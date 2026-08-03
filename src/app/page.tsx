import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/current-user";
import ShootingStarsAndStarsBackgroundDemo from "@/components/shooting-stars-and-stars-background-demo";

export default async function HomePage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return <ShootingStarsAndStarsBackgroundDemo />;
}