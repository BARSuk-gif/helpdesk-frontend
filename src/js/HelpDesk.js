import TicketForm from './TicketForm';
import TicketView from './TicketView';

/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = ticketService;
  }

  async init() {
    this.view = new TicketView(this.container, this.ticketService);
    this.view.mount();

    this.modalForm = new TicketForm(this.container);
    this.modalForm.mount();

    this.addListener();

    try {
      this.view.ticketsContainer.classList.add('loading');
      this.view.ticketsContainer.textContent = 'Загрузка тикетов...';
      const tickets = await this.ticketService.list();
      this.view.renderList(tickets);
    } catch (err) {
      this.view.ticketsContainer.textContent = 'Не удалось загрузить тикеты';
    } finally {
      this.view.ticketsContainer.classList.remove('loading');
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  addListener() {
    // нажатие на кнопку добавить тикет
    this.view.btnAddTicket.addEventListener('click', this.onCreateTicket.bind(this));

    // клик по кнопке Ok модалки - добавить тикет
    this.modalForm.getAddSaveButton().addEventListener('click', async () => {
      const button = this.modalForm.getAddSaveButton();
      const name = this.modalForm.getAddNameInput().value.trim();

      if (!name) {
        this.modalForm.showAddError('Введите краткое описание');
        this.modalForm.getAddNameInput().focus();
        return;
      }

      try {
        this.setButtonLoading(button, true);
        await this.addNewTicket();
      } catch (err) {
        const message = err.message.includes('Network')
          ? 'Нет соединения с сервером. Попробуйте позже.'
          : 'Не удалось создать тикет. Проверьте данные и попробуйте снова.';
        this.modalForm.showAddError(message);
      } finally {
        this.setButtonLoading(button, false);
      }
    });

    //  клик по кнопке Отмена модалки - добавить тикет
    this.modalForm.getAddCancelButton().addEventListener('click', this.onCloseAddForm.bind(this));
    //  клик по полю
    this.modalForm.modalRoot.addEventListener('click', (e) => {
      if (e.target === this.modalForm.modalRoot) {
        this.onCloseAddForm();
        this.onCloseUploadForm();
        this.onCloseDeleteForm();
      }
    });
    //  клик по кнопке Esc
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;

      if (this.modalForm.modalAddTicket.classList.contains('active-modal')) {
        this.onCloseAddForm();
      }
      if (this.modalForm.modalUploadTicket.classList.contains('active-modal')) {
        this.onCloseUploadForm();
      }
      if (this.modalForm.modalDeleteTicket.classList.contains('active-modal')) {
        this.onCloseDeleteForm();
      }
    });

    //  клик по кнопке Ok модалки - изменить тикет
    this.modalForm.getUploadSaveButton().addEventListener('click', async () => {
      const button = this.modalForm.getUploadSaveButton();
      const name = this.modalForm.getUploadNameInput().value.trim();
      const description = this.modalForm.getUploadDescriptionInput().value.trim();

      if (!name) {
        this.modalForm.showUploadError('Введите краткое описание');
        this.modalForm.getUploadNameInput().focus();
        return;
      }

      try {
        this.setButtonLoading(button, true);
        const updated = await this.ticketService.update(this.currentEditId, { name, description });
        this.view.updateTicket(this.currentEditId, updated);
        this.onCloseUploadForm();
      } catch (err) {
        this.modalForm.showUploadError('Не удалось обновить тикет');
      } finally {
        this.setButtonLoading(button, false);
      }
    });

    //  клик по кнопке Отмена модалки - изменить тикет
    this.modalForm.getUploadCancelButton().addEventListener('click', this.onCloseUploadForm.bind(this));

    //  клик по кнопке Ok модалки - удалить тикет
    this.modalForm.getDeleteSaveButton().addEventListener('click', async () => {
      const button = this.modalForm.getDeleteSaveButton();
      try {
        this.setButtonLoading(button, true);
        await this.ticketService.delete(this.currentDeleteId);
        this.view.removeTicket(this.currentDeleteId);
        this.onCloseDeleteForm();
      } catch (err) {
        this.modalForm.showDeleteError('Не удалось удалить тикет');
      } finally {
        this.setButtonLoading(button, false);
      }
    });

    //  клик по кнопке Отмена модалки - удалить тикет
    this.modalForm.getDeleteCancelButton().addEventListener('click', this.onCloseDeleteForm.bind(this));

    // клик по кнопкам главной модалки
    this.view.ticketsContainer.addEventListener('click', (e) => {
      // клик по кнопке «Изменить»
      if (e.target.matches('.btn-modify-ticket')) {
        const fieldset = e.target.closest('.fieldset-ticket');
        this.onModifyTicket(fieldset.dataset.id);
        return;
      }

      // клик по кнопке «Удалить»
      if (e.target.matches('.btn-delete-ticket')) {
        const fieldset = e.target.closest('.fieldset-ticket');
        this.onOpenDeleteForm(fieldset.dataset.id);
        return;
      }

      // клик по чекбоксу
      if (e.target.matches('.ticket-status')) {
        const fieldset = e.target.closest('.fieldset-ticket');
        this.onToggleStatus(fieldset.dataset.id, e.target.checked, e.target);
        return;
      }

      // клик по телу тикета
      const fieldset = e.target.closest('.fieldset-ticket');
      if (fieldset && !e.target.matches('input, button, textarea')) {
        this.onToggleDescription(fieldset.dataset.id);
      }
    });
  }

  // -----------------------создание нового тикета------------------
  onCreateTicket() {
    // показываем модалку
    this.modalForm.modalAddTicket.classList.add('active-modal');
    this.modalForm.modalRoot.classList.add('active-modal-root');

    // очищаем поля
    this.modalForm.getAddNameInput().value = '';
    this.modalForm.getAddDescriptionInput().value = '';
    this.modalForm.clearAddError();

    this.modalForm.getAddNameInput().focus();
  }

  async addNewTicket() {
    const name = this.modalForm.getAddNameInput().value;
    const description = this.modalForm.getAddDescriptionInput().value;

    const created = await this.ticketService.create({ name, description });
    this.view.renderTicket(created);
    this.onCloseAddForm();
  }

  onCloseAddForm() {
    // очищаем поля
    this.modalForm.getAddNameInput().value = '';
    this.modalForm.getAddDescriptionInput().value = '';
    this.modalForm.clearAddError();

    // скрываем модалку
    this.modalForm.modalAddTicket.classList.remove('active-modal');
    this.modalForm.modalRoot.classList.remove('active-modal-root');
  }

  // ---------------------изменение тикета--------------------------

  async onModifyTicket(id) {
    try {
      const ticket = await this.ticketService.get(id);
      // заполняем поля модалки
      this.modalForm.getUploadNameInput().value = ticket.name;
      this.modalForm.getUploadDescriptionInput().value = ticket.description ?? '';
      // показываем модалку
      this.modalForm.modalUploadTicket.classList.add('active-modal');
      this.modalForm.modalRoot.classList.add('active-modal-root');
      this.currentEditId = ticket.id;
    } catch (err) {
      this.modalForm.showUploadError('Не удалось загрузить тикет');
    }
  }

  onCloseUploadForm() {
    // очищаем поля
    this.modalForm.getUploadNameInput().value = '';
    this.modalForm.getUploadDescriptionInput().value = '';
    this.modalForm.clearUploadError();

    // скрываем модалку
    this.modalForm.modalUploadTicket.classList.remove('active-modal');
    this.modalForm.modalRoot.classList.remove('active-modal-root');
  }

  async onToggleStatus(id, status, checkbox) {
    try {
      checkbox.disabled = true;
      await this.ticketService.update(id, { status });
    } catch (err) {
      checkbox.checked = !status;
      this.view.showTicketError(id, 'Не удалось обновить статус');
    } finally {
      checkbox.disabled = false;
    }
  }

  async onToggleDescription(id) {
    const fieldset = this.view.ticketsContainer.querySelector(`[data-id="${id}"]`);
    if (!fieldset) return;

    const isOpen = this.view.isDescriptionOpen(id);

    // если уже открыто — просто скрыть
    if (isOpen) {
      this.view.toggleDescription(id);
      return;
    }

    // если ещё не загружали — запросить
    const loaded = fieldset.dataset.loaded === 'true';

    if (!loaded) {
      try {
        fieldset.classList.add('loading');
        const ticket = await this.ticketService.get(id);
        this.view.setDescription(id, ticket.description);
        fieldset.dataset.loaded = 'true';
      } catch (err) {
        this.view.showTicketError(id, 'Не удалось загрузить описание');
        return;
      } finally {
        fieldset.classList.remove('loading');
      }
    }

    this.view.toggleDescription(id);
  }

  // -------------------------удаление тикета-------------------------------------------------

  onOpenDeleteForm(id) {
    this.currentDeleteId = id;
    // показываем модалку
    this.modalForm.modalDeleteTicket.classList.add('active-modal');
    this.modalForm.modalRoot.classList.add('active-modal-root');
  }

  onCloseDeleteForm() {
    // сбросить id
    this.currentDeleteId = null;
    // скрываем модалку
    this.modalForm.modalDeleteTicket.classList.remove('active-modal');
    this.modalForm.modalRoot.classList.remove('active-modal-root');
  }

  setButtonLoading(button, isLoading, loadingText = 'Отправка...') {
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = loadingText;
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || 'Ok';
      button.disabled = false;
    }
  }
}
