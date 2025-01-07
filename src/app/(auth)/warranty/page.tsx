import { cn } from "@/lib/utils";
import { getCurrent } from "@/features/auth/action";
import { RegisterWarrantyCard } from "@/features/auth/components/register-warranty-card";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
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
        "flex flex-col items-center justify-center",
        "bg-dark",
        "w-full min-h-screen",
        "px-4 lg:px-0"
      )}>
      <RegisterWarrantyCard />
    </div>
  );
}
