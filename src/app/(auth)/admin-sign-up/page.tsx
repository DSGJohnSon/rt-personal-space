import { cn } from "@/lib/utils";

import { getCurrent } from "@/features/auth/action";

import { redirect } from "next/navigation";
import { RegisterAdminCard } from "@/features/auth/components/register-admin-card";

export default async function AdminSignUpPage() {
  const user = await getCurrent();
  if (user && user.labels.includes("admin")) {
    redirect("/admin");
  }
  if (user) {
    redirect("/");
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "bg-dark",
        "w-screen h-screen"
      )}>
      <RegisterAdminCard />
    </div>
  );
}
