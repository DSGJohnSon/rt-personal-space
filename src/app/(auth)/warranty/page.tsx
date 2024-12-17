import { cn } from "@/lib/utils";
import { getCurrent } from "@/features/auth/action";
import { RegisterWarrantyCard } from "@/features/auth/components/register-warranty-card";
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
      <RegisterWarrantyCard />
    </div>
  );
}
