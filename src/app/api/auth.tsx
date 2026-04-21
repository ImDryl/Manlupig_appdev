const BASE_URL = 'http://127.0.0.1:8000/api';
const LOGIN_TIMEOUT_MS = 15000;

const options = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

type LoginPayload = {
  username: string;
  password: string;
};

export async function authLogin({ username, password }: LoginPayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      ...options,
      body: JSON.stringify({
        username,
        password,
      }),
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Server timeout. Check BASE_URL and API server.');
    }
    if (error instanceof Error) {
      throw new Error(error.message || 'Network request failed');
    }
    throw new Error('Network request failed');
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await response.json();

  if (response.ok) {
    return data;
  }
  throw new Error(data.message || 'Login failed');
}
