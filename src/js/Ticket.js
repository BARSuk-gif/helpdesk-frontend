export default class Ticket {
  constructor({ id = null, name = '', description = '', status = false, created = Date.now() }) {
    this.id = String(id);
    this.name = String(name);
    this.description = String(description);
    this.status = Boolean(status);
    this.created = Number(created);
  }

  // в работе status=false
  get inWork() {
    return !this.status;
  }

  // выполнено status=true
  get Completed() {
    return this.status;
  }

  get createFormatted() {
    return new Date(this.created).toLocaleString('ru-RU');
  }

  // изменение
  update({ name, description, status } = {}) {
    if (name !== undefined) this.name = String(name).trim();
    if (description !== undefined) this.description = String(description).trim();
    if (status !== undefined) this.status = Boolean(status);
    return this;
  }

  // сериализация
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      created: this.created,
    };
  }

  toCreatepayload() {
    return { name: this.name, description: this.description };
  }

  clone() {
    return new Ticket({ ...this });
  }

  static createEmpty() {
    return new Ticket();
  }
}
