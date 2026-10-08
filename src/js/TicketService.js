/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
import createRequest from './api/createRequest';

export default class TicketService {
  constructor(baseUrl = '', request = createRequest) {
    this.baseUrl = baseUrl;
    this.request = request;
  }

  _request({ httpMethod, query = {}, body = null }) {
    const url = `${this.baseUrl}/?${new URLSearchParams(query)}`;
    return this.request({ url, method: httpMethod, body });
  }

  /**
   * Получить список тикетов.
   */
  list() {
    return this._request({ httpMethod: 'GET', query: { method: 'allTickets' } });
  }

  /**
   * Получить тикет по id.
   */
  get(id) {
    return this._request({ httpMethod: 'GET', query: { method: 'ticketById', id } });
  }

  /**
   * Создать тикет. id=null(гененрится на сервере) name, description, status получаем из формы
   */
  create(data) {
    return this._request({
      httpMethod: 'POST',
      query: { method: 'createTicket' },
      body: data,
    });
  }

  /**
   * В теле запроса форма с полями для обновления объекта типа ticket по id
   */
  update(id, data) {
    return this._request({
      httpMethod: 'POST',
      query: { method: 'updateById', id },
      body: data,
    });
  }

  /**
   * Удалить объект типа ticket по id. При успешном запросе статус ответа 204
   */
  delete(id) {
    return this._request({ httpMethod: 'GET', query: { method: 'deleteById', id } });
  }
}
