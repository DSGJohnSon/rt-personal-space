"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { adminPages, adminPageType } from "@/data/data";
import UserButtonSidebar from "@/features/auth/components/user-button-sidebar";
import { cn } from "@/lib/utils";
import { LucideHome, LucideMenu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function AdminSidebarMobile() {
  const [isSheetOpened, setIsSheetOpened] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsSheetOpened(false);
  }, [pathname]);

  return (
    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
      <SheetTrigger asChild className="fixed top-2 right-2">
        <Button variant={"outline"} size={"icon"}>
          <LucideMenu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 w-[90svw]">
        <div
          className={cn(
            "w-full h-screen",
            "flex flex-col items-center justify-between"
          )}>
          <div className="flex flex-col w-full h-full items-center">
            <div className="flex items-center justify-between w-full p-4">
              <div
                className={cn(
                  "text-xl font-bold text-slate-800 cursor-pointer",
                  "transition-all opacity-100 duration-300"
                )}>
                Panel Admin
              </div>
            </div>
            <div className="flex flex-col w-full border-t border-slate-300">
              <LinkSidebar
                item={{
                  href: "/admin",
                  label: "Dashboard",
                  icon: LucideHome,
                  zone: "main",
                }}
              />
            </div>
            <div className="flex flex-col w-full">
              <p className="text-xs text-slate-500 p-4 border-t border-slate-300 truncate">
                Content
              </p>
              {
                // On filtre les éléments de la navigation pour ne garder que ceux avec zone: "main"
                adminPages
                  .filter((item) => item.zone === "content")
                  .map((item, index) => (
                    <LinkSidebar key={item.href + index} item={item} />
                  ))
              }
            </div>
            <div className="flex flex-col w-full">
              <p className="text-xs text-slate-500 p-4 border-t border-slate-300 truncate">
                Datas
              </p>
              {
                // On filtre les éléments de la navigation pour ne garder que ceux avec zone: "main"
                adminPages
                  .filter((item) => item.zone === "data")
                  .map((item, index) => (
                    <LinkSidebar key={item.href + index} item={item} />
                  ))
              }
            </div>
          </div>
          <div className="flex flex-col w-full">
            <p className="text-xs text-slate-500 p-4 border-t border-slate-300 truncate">
              Admin Settings
            </p>
            {
              // On filtre les éléments de la navigation pour ne garder que ceux avec zone: "main"
              adminPages
                .filter((item) => item.zone === "admin")
                .map((item, index) => (
                  <LinkSidebar key={item.href + index} item={item} />
                ))
            }
          </div>

          <UserButtonSidebar isFolded={false} isFoldedDelayed={false} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AdminSidebarMobile;

const LinkSidebar = ({ item }: { item: adminPageType }) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      title={item.label}
      className={cn(
        "flex items-center w-full p-4",
        "text-slate-900 hover:bg-slate-100",
        item.href === pathname && "bg-slate-100",
        "transition-all duration-300"
      )}>
      <item.icon size={16} className="mb-1" />
      <span className={cn("ml-2", "transition-all opacity-100 duration-300")}>
        {item.label}
      </span>
    </Link>
  );
};
