import { cn } from "@/lib/utils";

import { getCurrent } from "@/features/auth/action";
import { SignInCard } from "@/features/auth/components/sign-in-card";

import { redirect } from "next/navigation";

export default async function SignInPage() {
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
      <SignInCard />
    </div>
  );
}
