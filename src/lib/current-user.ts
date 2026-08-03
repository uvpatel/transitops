import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}
