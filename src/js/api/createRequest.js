const createRequest = (options = {}) => {
  const { url, method, body, headers = {} } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';

    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Content-Type — только если есть тело и он не задан явно
    if (body && !headers['Content-Type']) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.status === 204 ? null : xhr.response);
      } else {
        const message = xhr.response?.message || `HTTP ${xhr.status}`;
        reject(new Error(`${message} (${url})`));
      }
    });
    xhr.addEventListener('error', () => reject(new Error(`Network error: ${url}`)));
    xhr.addEventListener('abort', () => reject(new Error(`Aborted: ${url}`)));

    let payload = null;
    if (body) {
      payload = typeof body === 'string' ? body : JSON.stringify(body);
    }
    xhr.send(payload);
  });
};

export default createRequest;
