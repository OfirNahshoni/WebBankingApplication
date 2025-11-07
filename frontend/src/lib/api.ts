const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

const API_BASE_URL = env.VITE_API_BASE_URL ?? "http://localhost:3000";

function withJson(body: unknown): RequestInit {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  };
}

async function wait(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { email: string; name?: string };
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      ...withJson(payload),
    });

    if (!response.ok) {
      throw new Error("Login request failed");
    }

    return (await response.json()) as LoginResponse;
  } catch (error) {
    console.warn("[api] login stub fallback", error);
    await wait();
    return { token: "demo-token", user: { email: payload.email } };
  }
}

export type SignupPayload = {
  email: string;
  password: string;
  phone: string;
};

export async function signup(payload: SignupPayload): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      ...withJson(payload),
    });

    if (!response.ok) {
      throw new Error("Signup request failed");
    }
  } catch (error) {
    console.warn("[api] signup stub fallback", error);
    await wait();
  }
}

export type TransferPayload = {
  to: string;
  amount: number;
};

export async function transfer(payload: TransferPayload): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
      method: "POST",
      ...withJson(payload),
    });

    if (!response.ok) {
      throw new Error("Transfer request failed");
    }
  } catch (error) {
    console.warn("[api] transfer stub fallback", error);
    await wait();
  }
}

export type WithdrawPayload = {
  amount: number;
};

export async function withdraw(payload: WithdrawPayload): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
      method: "POST",
      ...withJson(payload),
    });

    if (!response.ok) {
      throw new Error("Withdraw request failed");
    }
  } catch (error) {
    console.warn("[api] withdraw stub fallback", error);
    await wait();
  }
}

export type DepositPayload = {
  amount: number;
};

export async function deposit(payload: DepositPayload): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
      method: "POST",
      ...withJson(payload),
    });

    if (!response.ok) {
      throw new Error("Deposit request failed");
    }
  } catch (error) {
    console.warn("[api] deposit stub fallback", error);
    await wait();
  }
}
