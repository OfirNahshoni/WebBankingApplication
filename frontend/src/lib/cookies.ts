const TOKEN_COOKIE_KEY = "auth_token";
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const isBrowser = typeof document !== "undefined";

function buildCookieString(value: string, maxAge = DEFAULT_MAX_AGE): string {
  const attributes = [
    `${TOKEN_COOKIE_KEY}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${maxAge}`,
    "SameSite=Lax",
  ];

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function setTokenCookie(token: string, maxAge = DEFAULT_MAX_AGE): void {
  if (!isBrowser) return;
  document.cookie = buildCookieString(token, maxAge);
}

export function getTokenCookie(): string | null {
  if (!isBrowser) return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === TOKEN_COOKIE_KEY) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

export function clearTokenCookie(): void {
  if (!isBrowser) return;
  document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax; Secure`;
  }
}
