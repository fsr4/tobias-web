type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export class APIHandler {
  public readonly baseURL = process.env.VUE_APP_API_HOST;

  private static instance: APIHandler;

  public static getInstance(): APIHandler {
    if (!this.instance)
      this.instance = new this();

    return this.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async get(path: string, queryParameters?: Record<string, unknown>): Promise<any> {
    const query = this.buildQuery(queryParameters);

    const response = await this.fetch('GET', path + query);
    if (!response.ok)
      throw await response.json();

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async post(path: string, body?: Record<string, unknown>, queryParameters?: Record<string, unknown>): Promise<any> {
    const query = this.buildQuery(queryParameters);

    const response = await this.fetch('POST', path + query, body);
    if (!response.ok)
      throw await response.json();

    if (response.status === 204)
      return;

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async patch(path: string, body?: Record<string, unknown>, queryParameters?: Record<string, unknown>): Promise<any> {
    const query = this.buildQuery(queryParameters);

    const response = await this.fetch('PATCH', path + query, body);
    if (!response.ok)
      throw await response.json();

    if (response.status === 204)
      return;

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async del(path: string): Promise<any> {
    const response = await this.fetch('DELETE', path);
    if (!response.ok)
      throw await response.json();

    if (response.status === 204)
      return;

    return response.json();
  }

  private buildQuery(queryParameters?: Record<string, unknown>): string {
    if (!queryParameters)
      return '';
    return '?' + Object.keys(queryParameters)
      .map(key => key + '=' + queryParameters[key])
      .join('&');
  }

  private async fetch(method: HTTPMethod, path: string, body?: unknown): Promise<Response> {
    const request: RequestInit = {
      method: method,
      headers: [
        ['Accept', 'application/json']
      ]
    };
    if (body) {
      request.body = JSON.stringify(body);
      (request.headers as string[][]).push(['Content-Type', 'application/json']);
    }
    return fetch(this.baseURL + path, request);
  }
}

export default APIHandler.getInstance();
