"use client";

import { Button } from "@/components/ui/button";
import { adminPages, adminPageType } from "@/data/data";
import UserButtonSidebar from "@/features/auth/components/user-button-sidebar";
import { cn } from "@/lib/utils";
import {
  LucideChevronsLeft,
  LucideChevronsRight,
  LucideHome,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function AdminSidebar() {
  const [isFolded, setIsFolded] = useState(false);
  const [isFoldedDelayed, setIsFoldedDelayed] = useState(false);

  const handleFoldSidebar = () => {
    //Si la side bar n'est pas pliée, on la plie en mettant à jour le statut de isFoldedDelayed 300ms avant
    if (!isFolded) {
      setIsFoldedDelayed(true);
      setTimeout(() => {
        setIsFolded(true);
      }, 300);
    } else {
      setIsFolded(false);
      setTimeout(() => {
        setIsFoldedDelayed(false);
      }, 300);
    }
  };

  return (
    <div
      className={cn(
        "w-[15%] min-w-[240px] h-screen",
        "flex flex-col items-center justify-between",
        "bg-white border-r border-slate-300 transition-all duration-300",
        isFolded && "w-16 min-w-16"
      )}>
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex items-center justify-between w-full p-4">
          <div
            className={cn(
              "text-xl font-bold text-slate-800 cursor-pointer",
              "transition-all opacity-100 duration-300",
              isFoldedDelayed && "opacity-0",
              isFolded && "hidden"
            )}>
            Panel Admin
          </div>
          <Button variant={"ghost"} size={"icon"} onClick={handleFoldSidebar}>
            {isFolded ? (
              <LucideChevronsRight size={24} />
            ) : (
              <LucideChevronsLeft size={24} />
            )}
          </Button>
        </div>
        <div className="flex flex-col w-full border-t border-slate-300">
          <LinkSidebar
            item={{
              href: "/admin",
              label: "Dashboard",
              icon: LucideHome,
              zone: "main",
            }}
            isFolded={isFolded}
            isFoldedDelayed={isFoldedDelayed}
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
                <LinkSidebar
                  key={item.href + index}
                  item={item}
                  isFolded={isFolded}
                  isFoldedDelayed={isFoldedDelayed}
                />
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
                <LinkSidebar
                  key={item.href + index}
                  item={item}
                  isFolded={isFolded}
                  isFoldedDelayed={isFoldedDelayed}
                />
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
              <LinkSidebar
                key={item.href + index}
                item={item}
                isFolded={isFolded}
                isFoldedDelayed={isFoldedDelayed}
              />
            ))
        }
      </div>

      <UserButtonSidebar
        isFolded={isFolded}
        isFoldedDelayed={isFoldedDelayed}
      />
    </div>
  );
}

export default AdminSidebar;

const LinkSidebar = ({
  item,
  isFolded,
  isFoldedDelayed,
}: {
  item: adminPageType;
  isFolded: boolean;
  isFoldedDelayed: boolean;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      title={item.label}
      className={cn(
        "flex items-center w-full p-4",
        "text-slate-900 hover:bg-slate-100",
        item.href === pathname && "bg-slate-100",
        "transition-all duration-300",
        isFolded && "justify-center"
      )}>
      <item.icon size={16} className="mb-1" />
      <span
        className={cn(
          "ml-2",
          "transition-all opacity-100 duration-300",
          isFoldedDelayed && "opacity-0",
          isFolded && "hidden"
        )}>
        {item.label}
      </span>
    </Link>
  );
};
