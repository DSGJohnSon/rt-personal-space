import { getCurrent } from "@/features/auth/action";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const user = await getCurrent();

  console.log(user);

  if (user) redirect("/");

  return <SignInCard />;
}
