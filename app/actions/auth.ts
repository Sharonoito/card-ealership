"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid username or password. Please try again.";
    }
    throw error; // Re-throw NEXT_REDIRECT
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
