const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

// Thin fetch wrapper: sends the httpOnly auth cookie on every request and
// normalizes error responses. Extend as needed (e.g. query-string helpers).
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    const message = !body.success ? body.error : "Request failed";
    throw new Error(message);
  }

  return body.data;
}
