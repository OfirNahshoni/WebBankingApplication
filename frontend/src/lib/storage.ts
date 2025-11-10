import { clearTokenCookie, getTokenCookie, setTokenCookie } from "./cookies";

const isBrowser = typeof window !== "undefined";

export function getToken(): string | null {
  if (!isBrowser) return null;
  return getTokenCookie();
}

export function setToken(token: string): void {
  if (!isBrowser) return;
  setTokenCookie(token);
}

export function clearToken(): void {
  if (!isBrowser) return;
  clearTokenCookie();
}
