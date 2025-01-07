"use client";

import { Loader, LogOut } from "lucide-react";

import { useCurrent } from "../api/use-current";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "../api/use-logout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserButtonSidebar({
  isFolded,
  isFoldedDelayed,
}: {
  isFolded: boolean;
  isFoldedDelayed: boolean;
}) {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="p-4 w-full border-t border-slate-300 flex items-center justify-between">
        <div className="flex itemx-center gap-3 w-full pr-8">
          <Avatar className="size-10 transition cursor-default relative">
            <AvatarFallback>
              <Skeleton className="w-full h-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader className="size-4 animate-spin text-muted-foreground" />
              </div>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full gap-1 justify-center">
            <span>
              <Skeleton className="w-full h-3 rounded-full" />
            </span>
            <span>
              <Skeleton className="w-24 h-2 rounded-full" />
            </span>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => logout()}
          className="text-amber-700 hover:text-amber-700 font-medium cursor-pointer">
          <LogOut className="size-4" />
        </Button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  if (!isFolded && !isFoldedDelayed) {
    return (
      <div className="p-4 w-full border-t border-slate-300 flex items-center justify-between">
        <div className="flex itemx-center gap-3">
          <Avatar className="size-10 transition border border-slate-300 cursor-default">
            <AvatarFallback className="bg-slate-200 font-medium text-slate-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{user.name}</span>
            <span className="text-[0.5rem] text-slate-500">{user.email}</span>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => logout()}
          className="text-amber-700 hover:text-amber-700 font-medium cursor-pointer">
          <LogOut className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative border-t border-slate-300 w-full flex justify-center py-3">
        <Avatar className="size-10 hover:opacity-75 transition border border-slate-300">
          <AvatarFallback className="bg-slate-200 font-medium text-slate-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="w-60 ml-2"
        sideOffset={10}>
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] transition border border-slate-300">
            <AvatarFallback className="bg-slate-200 text-xl font-medium text-slate-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-slate-900">
              {name || "User"}
            </p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
        </div>
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer">
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
