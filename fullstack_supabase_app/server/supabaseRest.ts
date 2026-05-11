type QueryValue = string | number | boolean | null | undefined;

const rawRestUrl = process.env.SUPABASE_REST_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY;

if (!rawRestUrl || !serviceKey) {
  console.warn('Missing SUPABASE_REST_URL/SUPABASE_SERVICE_ROLE_KEY. API routes will fail until .env is configured.');
}

const restUrl = rawRestUrl?.endsWith('/rest/v1/')
  ? rawRestUrl
  : rawRestUrl?.replace(/\/$/, '') + '/rest/v1/';

function buildUrl(table: string, query?: Record<string, QueryValue>) {
  const url = new URL(table, restUrl);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
}

async function request<T>(
  table: string,
  init: RequestInit & { query?: Record<string, QueryValue>; prefer?: string } = {}
): Promise<T> {
  if (!restUrl || !serviceKey) {
    throw new Error('Supabase is not configured. Check .env values.');
  }

  const response = await fetch(buildUrl(table, init.query), {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: init.prefer || 'return=representation',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const db = {
  select<T>(table: string, query?: Record<string, QueryValue>) {
    return request<T[]>(table, { method: 'GET', query });
  },

  insert<T>(table: string, rows: unknown[], query?: Record<string, QueryValue>) {
    return request<T[]>(table, {
      method: 'POST',
      query,
      body: JSON.stringify(rows),
    });
  },

  upsert<T>(table: string, rows: unknown[], query?: Record<string, QueryValue>) {
    return request<T[]>(table, {
      method: 'POST',
      query,
      prefer: 'resolution=merge-duplicates,return=representation',
      body: JSON.stringify(rows),
    });
  },

  update<T>(table: string, values: unknown, query?: Record<string, QueryValue>) {
    return request<T[]>(table, {
      method: 'PATCH',
      query,
      body: JSON.stringify(values),
    });
  },

  delete(table: string, query?: Record<string, QueryValue>) {
    return request<void>(table, {
      method: 'DELETE',
      query,
      prefer: 'return=minimal',
    });
  },
};
