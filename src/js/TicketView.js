/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor(container, ticketService) {
    this.container = container;
    this.ticketService = ticketService;
  }

  mount() {
    this.formContainer = document.createElement('div');
    this.formContainer.className = 'container';

    // верхняя рамка
    this.frameContainer = document.createElement('div');
    this.frameContainer.className = 'frame-container';

    this.formContainer.append(this.frameContainer);

    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.className = 'circle';
      this.frameContainer.appendChild(el);
    }

    this.createForm();
    this.container.append(this.formContainer);
  }

  createForm() {
    // создаем форму
    this.form = document.createElement('form');
    this.form.className = 'form-ticket-view';

    this.formContainer.append(this.form);

    // кнопка добавления тикета
    this.btnAddTicket = document.createElement('button');
    this.btnAddTicket.type = 'button';
    this.btnAddTicket.className = 'btn-add-ticket';
    this.btnAddTicket.textContent = 'Добавить тикет';

    this.form.append(this.btnAddTicket);

    // создаем шаблон для HTML
    this.ticketTemplate = document.createElement('template');
    this.ticketTemplate.id = 'ticketTemplate';

    this.ticketsContainer = document.createElement('div');
    this.ticketsContainer.className = 'ticket-container';
    this.ticketsContainer.id = 'tickets';

    this.formContainer.append(this.ticketTemplate);
    this.form.append(this.ticketsContainer);

    // создаем fieldset
    this.fieldsetTicket = document.createElement('fieldset');
    this.fieldsetTicket.className = 'fieldset-ticket';
    // this.fieldsetTicket.dataset.id = 'ticket-id';

    const fieldsetContent = `
      <legend class="legend"></legend>     
      <input 
        type="checkbox" 
        name="ticket-status" 
        class="ticket-status">
      <input 
        type="text" 
        name="ticket-name"
        class="ticket-name">
      <input 
        type="datetime-local"
        name="ticket-created"
        class="ticket-data">      
      <button type="button" class="btn-modify-ticket"></button>
      <button type="button" class="btn-delete-ticket">X</button>
      <textarea 
        name="ticket-description" 
        class="ticket-description"></textarea>
    `;
    this.fieldsetTicket.insertAdjacentHTML('beforeend', fieldsetContent);
    this.ticketTemplate.content.append(this.fieldsetTicket);
  }

  renderTicket(ticket) {
    const clone = this.ticketTemplate.content.cloneNode(true);
    const fieldset = clone.querySelector('.fieldset-ticket');
    fieldset.dataset.id = `${ticket.id}`;

    fieldset.querySelector('[name="ticket-name"]').value = ticket.name;
    fieldset.querySelector('[name="ticket-description"]').value = ticket.description ?? '';
    fieldset.querySelector('[name="ticket-status"]').checked = Boolean(ticket.status);
    fieldset.querySelector('[name="ticket-created"]').value = new Date(ticket.created).toISOString().slice(0, 16);

    this.ticketsContainer.appendChild(clone);
    // return this.ticketsContainer.querySelector(`[data-id="${ticket.id}"]`);
  }

  renderList(tickets) {
    this.ticketsContainer.innerHTML = '';
    tickets.forEach((ticket) => {
      this.renderTicket(ticket);
    });
  }

  updateTicket(id, ticket) {
    const fieldset = this.ticketsContainer.querySelector(`[data-id="${id}"]`);
    if (!fieldset) return;

    fieldset.querySelector('[name="ticket-name"]').value = ticket.name;
    fieldset.querySelector('[name="ticket-description"]').value = ticket.description ?? '';
    fieldset.querySelector('[name="ticket-status"]').checked = Boolean(ticket.status);
    fieldset.querySelector('[name="ticket-created"]').value = new Date(ticket.created).toISOString().slice(0, 16);
  }

  removeTicket(id) {
    const fieldset = this.ticketsContainer.querySelector(`[data-id="${id}"]`);
    if (fieldset) fieldset.remove();
  }
}
