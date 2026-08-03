import { redirect } from "next/navigation";
import { getCurrentSession } from "./current-user";

export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}
