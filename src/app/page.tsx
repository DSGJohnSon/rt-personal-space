import { getCurrent, getUserInfo } from "@/features/auth/action";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  if (user && user.labels.includes("admin")) {
    redirect("/admin");
  }

  const userInfo = await getUserInfo(user.$id);

  return (
    <>
      <div>Page</div>
      <div>Hello {user?.email}</div>
      <div>{JSON.stringify(userInfo)}</div>
    </>
  );
}

export default Page;
