import { API_BASE_URL } from '../../config/api';

const REQUEST_TIMEOUT_MS = 15000;

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type ApiJson = {
  message?: string;
  success?: boolean;
  errors?: string[];
};

function networkHint(path: string): string {
  return (
    `Cannot reach ${API_BASE_URL}${path}. ` +
    'Start Agrinest on port 8000. Physical Android (USB): run "npm run reverse".'
  );
}

export async function postJson<T extends ApiJson>(
  path: string,
  body: Record<string, unknown>,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { ...defaultHeaders, ...extraHeaders },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        `No response from API (${API_BASE_URL}${path}) in ${REQUEST_TIMEOUT_MS / 1000}s.`,
      );
    }
    const hint = networkHint(path);
    if (error instanceof Error) {
      throw new Error(
        error.message === 'Network request failed' ? hint : error.message || hint,
      );
    }
    throw new Error(hint);
  } finally {
    clearTimeout(timeoutId);
  }

  let data: T;
  try {
    data = (await response.json()) as T;
  } catch {
    throw new Error(
      `Server error (${response.status}). Check Symfony logs and MySQL (docker compose up -d).`,
    );
  }

  if (response.ok) {
    return data;
  }

  const details =
    Array.isArray(data.errors) && data.errors.length > 0
      ? data.errors.join('\n')
      : undefined;
  throw new Error(
    details || data.message || `Request failed (${response.status})`,
  );
}
