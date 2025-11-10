import { getTokenCookie } from "./cookies";
import type { Transaction, TransactionListResponse, RawTransactionListResponse } from "../types";

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

export const BASE = env.VITE_API_URL ?? "http://localhost:3000/api/v1";

function authHeader(): HeadersInit {
  const token = getTokenCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(init.headers ?? {}),
  };

  const requestInit: RequestInit = {
    cache: init.cache ?? "no-store",
    ...init,
    headers,
  };

  if (init.body !== undefined && !(headers as Record<string, string>)["Content-Type"]) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(url, requestInit);
  const text = await response.text();
  const json = text ? (JSON.parse(text) as unknown) : undefined;

  if (!response.ok) {
    if (json && typeof json === "object" && "error" in json && typeof (json as { error: unknown }).error === "string") {
      throw new Error((json as { error: string }).error);
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (json && typeof json === "object" && "error" in json && typeof (json as { error: unknown }).error === "string") {
    throw new Error((json as { error: string }).error);
  }

  return json as T;
}

export type SignupBody = { email: string; password: string; phone: string };
export type SignupResponse = { message: string };

export async function signup(body: SignupBody): Promise<SignupResponse> {
  return request<SignupResponse>("/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type ActivateResponse = { token: string };

export async function activate(pincode: string, jwt: string): Promise<ActivateResponse> {
  return request<ActivateResponse>(`/auth/${encodeURIComponent(pincode)}/${encodeURIComponent(jwt)}`);
}

export type LoginBody = { email: string; password: string };
export type LoginResponse = { message: string; token: string; email: string };

export async function login(body: LoginBody): Promise<LoginResponse> {
  return request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type BalanceResponse = { balance: string };

export async function getBalance(): Promise<BalanceResponse> {
  return request<BalanceResponse>("/balance", {
    method: "GET",
    headers: {
      ...authHeader(),
    },
  });
}

export type UpdateBalanceResponse = { message: string; newBalance?: string };

export async function updateBalance(amount: number): Promise<UpdateBalanceResponse> {
  return request<UpdateBalanceResponse>("/update-balance", {
    method: "POST",
    headers: {
      ...authHeader(),
    },
    body: JSON.stringify({ amount }),
  });
}

export type TransferBody = { recipientEmail: string; amount: number };
export type TransferResponse = { message: string };

export async function transfer(body: TransferBody): Promise<TransferResponse> {
  const amount = Math.abs(body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const balanceResponse = await getBalance();
  const currentBalance = Number(balanceResponse.balance ?? 0);
  
  if (amount > currentBalance) {
    throw new Error("Insufficient balance for this transfer");
  }

  return request<TransferResponse>("/transactions", {
    method: "POST",
    headers: {
      ...authHeader(),
    },
    body: JSON.stringify({ ...body, amount }),
  });
}

export type WithdrawBody = { amount: number };
export type WithdrawResponse = UpdateBalanceResponse;

export async function withdraw(body: WithdrawBody): Promise<WithdrawResponse> {
  const amount = Math.abs(body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const balanceResponse = await getBalance();
  const currentBalance = Number(balanceResponse.balance ?? 0);

  if (amount > currentBalance) {
    throw new Error("Insufficient balance to withdraw the requested amount");
  }

  return updateBalance(-amount);
}

export type DepositBody = { amount: number };
export type DepositResponse = UpdateBalanceResponse;

export async function deposit(body: DepositBody): Promise<DepositResponse> {
  return updateBalance(Math.abs(body.amount));
}

export async function getTransactions(page: number, type: "in" | "out"): Promise<TransactionListResponse> {
  const PAGE_SIZE = 5;

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
    type,
  });

  const raw = await request<RawTransactionListResponse>(`/transactions?${params.toString()}`, {
    method: "GET",
    headers: {
      ...authHeader(),
    },
  });

  const items = Array.isArray(raw.items) ? raw.items : [];
  const mappedItems: Transaction[] = items.map((item) => ({
    id: item.id,
    amount: Number(item.amount ?? 0),
    from: type === "in" ? item.otherMail ?? "" : "",
    to: type === "out" ? item.otherMail ?? "" : "",
    status: type,
    date: item.date,
    row: item.row ?? 0,
  }));

  return {
    items: mappedItems,
    total: raw.total ?? mappedItems.length,
    totalPages: raw.totalPages ?? 1,
    page: raw.page ?? page,
    pageSize: raw.pageSize ?? PAGE_SIZE,
    hasNextPage: Boolean(raw.hasNextPage),
  };
}

export { request };
