import { API_BASE_URL, API_ORIGIN } from '../../config/api';

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

export function authHeaders(token: string | null): Record<string, string> {
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
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

export async function authGetJson<T extends ApiJson>(
  path: string,
  token: string,
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  return getJson<T>(path, query, authHeaders(token));
}

export async function authPostJson<T extends ApiJson>(
  path: string,
  token: string,
  body: Record<string, unknown>,
): Promise<T> {
  return postJson<T>(path, body, authHeaders(token));
}

export async function getJson<T extends ApiJson>(
  path: string,
  query?: Record<string, string | number | undefined>,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
  }
  const qs = params.toString();
  const url = `${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { ...defaultHeaders, ...extraHeaders },
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        `No response from API (${url}) in ${REQUEST_TIMEOUT_MS / 1000}s.`,
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
      `Server error (${response.status}). Check Symfony is running on port 8000.`,
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

/** Rewrites Symfony absolute URLs to the configured API host (device/emulator). */
export function resolveAssetUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    return `${API_ORIGIN}${parsed.pathname}${parsed.search}`;
  } catch {
    return url.startsWith('/') ? `${API_ORIGIN}${url}` : url;
  }
}
