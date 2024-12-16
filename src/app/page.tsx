import { getCurrent } from "@/features/auth/action";
import UserButton from "@/features/auth/components/user-button";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <>
      <div>Page</div>
      <div>Hello {user?.email}</div>
      <UserButton />
    </>
  );
}

export default Page;
