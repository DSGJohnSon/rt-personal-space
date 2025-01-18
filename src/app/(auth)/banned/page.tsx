import { getCurrent } from "@/features/auth/action";
import Banned from "@/features/auth/components/banned";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <main className="flex flex-col items-center justify-center h-screen w-full bg-dark relative z-[100]">
      <Banned />
    </main>
  );
}

export default Page;
