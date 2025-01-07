import BreadcrumbsBlock from "@/features/admin/components/breadcrumb-block";
import AdminSidebar from "@/features/admin/components/sidebar";
import AdminSidebarMobile from "@/features/admin/components/sidebar-mobile";
import { getCurrent } from "@/features/auth/action";
import { redirect } from "next/navigation";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  if (user && !user.labels.includes("admin")) {
    redirect("/");
  }

  return (
    <main className="bg-slate-50 flex items-center">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="block lg:hidden">
        <AdminSidebarMobile />
      </div>
      <div className="w-full min-h-screen flex flex-col p-[2svh] lg:p-[5svh]">
        <div className="h-[5svh]">
          <BreadcrumbsBlock />
        </div>
        <div className="h-[91svh] lg:h-[85svh] w-full border border-slate-300 bg-white overflow-hidden p-4">
          {children}
        </div>
      </div>
    </main>
  );
}
