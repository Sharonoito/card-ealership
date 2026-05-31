"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const maxLoginAttempts = 8;
const loginWindowMs = 15 * 60 * 1000;

function getLoginKey(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  return username || "unknown";
}

function isLoginRateLimited(key: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || attempt.resetAt < now) {
    loginAttempts.set(key, { count: 0, resetAt: now + loginWindowMs });
    return false;
  }

  return attempt.count >= maxLoginAttempts;
}

function recordFailedLogin(key: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || attempt.resetAt < now) {
    loginAttempts.set(key, { count: 1, resetAt: now + loginWindowMs });
    return;
  }

  loginAttempts.set(key, { ...attempt, count: attempt.count + 1 });
}

function clearFailedLogins(key: string) {
  loginAttempts.delete(key);
}

export async function loginAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const loginKey = getLoginKey(formData);

  if (isLoginRateLimited(loginKey)) {
    return "Too many login attempts. Please wait a few minutes and try again.";
  }

  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    clearFailedLogins(loginKey);
  } catch (error) {
    if (error instanceof AuthError) {
      recordFailedLogin(loginKey);
      return "Invalid username or password. Please try again.";
    }
    throw error; // Re-throw NEXT_REDIRECT
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
