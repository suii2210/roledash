export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type RequestOptions = {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  token?: string | null;
};

async function request<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export function signupRequest(body: {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}) {
  return request<{ user: AppUser; token: string }>("/auth/signup", {
    method: "POST",
    body,
  });
}

export function loginRequest(body: { email: string; password: string }) {
  return request<{ user: AppUser; token: string }>("/auth/login", {
    method: "POST",
    body,
  });
}

export function meRequest(token: string) {
  return request<{ user: AppUser }>("/auth/me", { token });
}

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};
