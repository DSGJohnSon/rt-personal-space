import { cn } from "@/lib/utils";
import { getCurrent } from "@/features/auth/action";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const user = await getCurrent();

  if (user) redirect("/");

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "bg-dark",
        "w-screen h-screen"
      )}>
      <SignUpCard />
    </div>
  );
}
