// One small helper for every network call the app makes. It always talks to
// our own Next.js server at /api/..., which then forwards to the backend.

// Shape every backend response follows: either success with data, or failure
// with a message. See API.md.
interface ApiSuccess<T> {
  success: true;
  data: T;
}
interface ApiFailure {
  success: false;
  message: string;
}

/**
 * Call the backend through the Next.js rewrite.
 * - `path` is the part after /api, e.g. "/auth/login".
 * - `options.body`, if given, is sent as JSON.
 * - `options.token`, if given, is sent as a Bearer token.
 * Throws a plain Error with the backend's message when something goes wrong.
 */
export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // Attach the login "wristband" (token) so the backend knows who we are.
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`/api${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  // The backend always answers with JSON, even on errors.
  const json = (await res.json()) as ApiSuccess<T> | ApiFailure;

  if (!json.success) {
    throw new Error(json.message);
  }
  return json.data;
}
