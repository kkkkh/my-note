interface RequestOptions extends RequestInit {
  token?: string; // 可选 token
  params?: Record<string, string>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// const BASE_URL = '/api'; // 可配合 rewrites 或代理


export interface Response<T> {
  data: T
  message: string
  success: boolean
}
export async function request<T>(url: string, options: RequestOptions = {}): Promise<Response<T>> {
  const { token, params,...rest } = options;

  const res = await fetch(BASE_URL + url + (params ? `?${new URLSearchParams(params).toString()}` : ''), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    const message = JSON.parse(text).message;
    throw new Error(message || '请求失败');
  }

  return res.json();
}
