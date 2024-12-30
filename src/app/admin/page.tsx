import { getCurrent } from "@/features/auth/action";
import UserButton from "@/features/auth/components/user-button";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  if (user && !user.labels.includes("admin")) {
    redirect("/");
  }

  return (
    <>
      <div className="text-3xl font-bold">ADMIN</div>
      <div>Hello {user?.email}</div>
      <UserButton />
    </>
  );
}

export default Page;
