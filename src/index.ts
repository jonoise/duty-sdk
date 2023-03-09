import { useEffect, useState } from 'react';
import { normalizeEndpoint } from './lib';

export class Client {
  private token: string;
  // private project: string;

  private url: string =
    'development' === process.env.NODE_ENV
      ? 'http://localhost:3000/api/v1'
      : 'https://tryduty.com/api/v1';

  constructor(token: string, project: string) {
    this.token = token;
    // this.project = project;
    this.url = `${this.url}/${project}`;
  }

  public async get<T>(endpoint: string, options?: RequestInit) {
    let _endpoint = normalizeEndpoint(endpoint);

    const res = await fetch(`${this.url}${_endpoint}`, {
      ...options,
      method: 'GET',
      headers: {
        ...options?.headers,
        'duty-token': this.token,
      },
    });

    if (!res.ok) {
      return {
        data: undefined,
        status: res.status,
        error: (await res.json()) as { message: string },
      };
    }

    return { data: (await res.json()) as T, status: res.status };
  }

  public async post<T>(endpoint: string, body: any, options?: RequestInit) {
    let _endpoint = normalizeEndpoint(endpoint);

    const res = await fetch(`${this.url}/${_endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        ...options?.headers,
        'duty-token': this.token,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = (await res.json()) as { message: string };
      return {
        data: undefined,
        status: res.status,
        error: error.message,
      };
    }

    return { data: (await res.json()) as T, status: res.status };
  }

  public async put<T>(endpoint: string, body: any, options?: RequestInit) {
    let _endpoint = normalizeEndpoint(endpoint);

    const res = await fetch(`${this.url}/${_endpoint}`, {
      ...options,
      method: 'PUT',
      headers: {
        ...options?.headers,
        'duty-token': this.token,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = (await res.json()) as { message: string };
      return {
        data: undefined,
        status: res.status,
        error: error.message,
      };
    }

    return { data: (await res.json()) as T, status: res.status };
  }

  public async delete<T>(endpoint: string, options?: RequestInit) {
    let _endpoint = normalizeEndpoint(endpoint);

    const res = await fetch(`${this.url}/${_endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: {
        ...options?.headers,
        'duty-token': this.token,
      },
    });

    if (!res.ok) {
      const error = (await res.json()) as { message: string };
      return {
        data: undefined,
        status: res.status,
        error: error.message,
      };
    }

    return { data: (await res.json()) as T, status: res.status };
  }

  /**
   * React hook to fetch data from the API.
   * @param endpoint The endpoint to fetch data from. It MUST start with a slash.
   *
   * Example:
   * ```js
   * const { data, error, isLoading } = useGet('/users');
   * ```
   */
  public useGet<T>(endpoint: string) {
    const _endpoint = normalizeEndpoint(endpoint);
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch(`${this.url}/${_endpoint}`, {
          method: 'GET',
          headers: {
            'duty-token': this.token,
          },
        });

        if (!res.ok) {
          const error = (await res.json()) as { message: string };
          setData(undefined);
          setError(error.message);
        } else {
          setData((await res.json()) as T);
          setError(undefined);
        }
        setIsLoading(false);
      };
      fetchData();
    }, [endpoint]);

    return {
      data,
      error,
      isLoading,
    };
  }

  // private async register<T>({
  //   username,
  //   password,
  // }: {
  //   username: string;
  //   password: string;
  // }) {
  //   const res = await fetch(`${this.url}/register`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'duty-token': this.token,
  //     },
  //     body: JSON.stringify({ username, password, project: this.project }),
  //   });

  //   if (!res.ok) {
  //     const error = (await res.json()) as { message: string };
  //     return {
  //       data: undefined,
  //       status: res.status,
  //       error: error.message,
  //     };
  //   } else {
  //     return {
  //       data: (await res.json()) as T,
  //       status: res.status,
  //       error: undefined,
  //     };
  //   }
  // }
}
