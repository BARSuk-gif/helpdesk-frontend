/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor(container) {
    this.container = container;
  }

  mount() {
    this.modalRoot = document.createElement('div');
    this.modalRoot.className = 'modal-root';

    this.container.append(this.modalRoot);

    this.createFormAdd();
    this.createFormUpload();
    this.createFormDelete();
  }

  createFormAdd() {
    this.modalAddTicket = document.createElement('div');
    this.modalAddTicket.className = 'modal-ticket';

    this.modalRoot.append(this.modalAddTicket);

    // создаем форму
    this.modalAddTitle = document.createElement('h2');
    this.modalAddTitle.className = 'modal-title';
    this.modalAddTitle.textContent = 'Добавить тикет';
    this.formAddTicket = document.createElement('form');
    this.formAddTicket.className = 'form-ticket';

    const modalAddFormContent = `
      <label class="label">Краткое описание</label>
      <input 
        type="text"
        name="name-add-ticket"
        class="name-add-ticket">
      <label class="label">Подробное описание</label>
      <textarea 
        name="description-add-ticket" 
        id="add-ticket" 
        class="description-add-ticket"></textarea>
      <div class="modal-error" hidden></div>
      <div class="btn-container">
        <button type="button" class="btn-add-cancel">Отмена</button>
        <button type="button" class="btn-add-save">Ok</button>
      </div>
    `;

    this.formAddTicket.insertAdjacentHTML('beforeend', modalAddFormContent);

    this.modalAddTicket.append(this.modalAddTitle);
    this.modalAddTicket.append(this.formAddTicket);
  }

  createFormUpload() {
    this.modalUploadTicket = document.createElement('div');
    this.modalUploadTicket.className = 'modal-ticket';

    this.modalRoot.append(this.modalUploadTicket);

    // создаем форму
    this.modalUploadTitle = document.createElement('h2');
    this.modalUploadTitle.className = 'modal-title';
    this.modalUploadTitle.textContent = 'Изменить тикет';
    this.formUploadTicket = document.createElement('form');
    this.formUploadTicket.className = 'form-ticket';

    const modalUploadFormContent = `
      <label class="label">Краткое описание</label>
      <input 
        type="text"
        name="name-upload-ticket"
        class="name-upload-ticket">
      <label class="label">Подробное описание</label>
      <textarea 
        name="description-upload-ticket" 
        id="upload-ticket" 
        class="description-upload-ticket"></textarea>
      <div class="modal-error" hidden></div>
      <div class="btn-container">
        <button type="button" class="btn-upload-cancel">Отмена</button>
        <button type="button" class="btn-upload-save">Ok</button>
      </div>
    `;

    this.formUploadTicket.insertAdjacentHTML('beforeend', modalUploadFormContent);

    this.modalUploadTicket.append(this.modalUploadTitle);
    this.modalUploadTicket.append(this.formUploadTicket);
  }

  createFormDelete() {
    this.modalDeleteTicket = document.createElement('div');
    this.modalDeleteTicket.className = 'modal-ticket';

    this.modalRoot.append(this.modalDeleteTicket);

    // создаем форму
    this.modalDeleteTitle = document.createElement('h2');
    this.modalDeleteTitle.className = 'modal-title';
    this.modalDeleteTitle.textContent = 'Удалить тикет';
    this.formDeleteTicket = document.createElement('form');
    this.formDeleteTicket.className = 'form-ticket';

    const modalDeleteFormContent = `
      <label class="label">
        Вы уверены, что хотите удалить тикет? Это действие необратимо.
      </label>
      <div class="modal-error" hidden></div>
      <div class="btn-container">
        <button type="button" class="btn-delete-cancel">Отмена</button>
        <button type="button" class="btn-delete-save">Ok</button>
      </div>
    `;

    this.formDeleteTicket.insertAdjacentHTML('beforeend', modalDeleteFormContent);

    this.modalDeleteTicket.append(this.modalDeleteTitle);
    this.modalDeleteTicket.append(this.formDeleteTicket);
  }

  getAddSaveButton() {
    return this.modalAddTicket.querySelector('.btn-add-save');
  }

  getAddCancelButton() {
    return this.modalAddTicket.querySelector('.btn-add-cancel');
  }

  getAddNameInput() {
    return this.modalAddTicket.querySelector('[name="name-add-ticket"]');
  }

  getAddDescriptionInput() {
    return this.modalAddTicket.querySelector('[name="description-add-ticket"]');
  }

  showAddError(message) {
    const errorEl = this.modalAddTicket.querySelector('.modal-error');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  clearAddError() {
    const errorEl = this.modalAddTicket.querySelector('.modal-error');
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  getUploadSaveButton() {
    return this.modalUploadTicket.querySelector('.btn-upload-save');
  }

  getUploadCancelButton() {
    return this.modalUploadTicket.querySelector('.btn-upload-cancel');
  }

  getUploadNameInput() {
    return this.modalUploadTicket.querySelector('[name="name-upload-ticket"]');
  }

  getUploadDescriptionInput() {
    return this.modalUploadTicket.querySelector('[name="description-upload-ticket"]');
  }

  showUploadError(message) {
    const errorEl = this.modalUploadTicket.querySelector('.modal-error');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  clearUploadError() {
    const errorEl = this.modalUploadTicket.querySelector('.modal-error');
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  getDeleteSaveButton() {
    return this.modalDeleteTicket.querySelector('.btn-delete-save');
  }

  getDeleteCancelButton() {
    return this.modalDeleteTicket.querySelector('.btn-delete-cancel');
  }

  showDeleteError(message) {
    const errorEl = this.modalDeleteTicket.querySelector('.modal-error');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  clearDeleteError() {
    const errorEl = this.modalDeleteTicket.querySelector('.modal-error');
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
}
