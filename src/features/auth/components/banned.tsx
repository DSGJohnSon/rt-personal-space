"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { LucideBan, LucideLoader, LucideLogOut } from "lucide-react";
import Link from "next/link";

function Banned() {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  return (
    <>
      <LucideBan className="text-creme pb-8 w-24 h-24" />
      <h1 className="font-marcellus font-bold text-3xl text-creme pb-8">
        Vous êtes banni de ce site par un administrateur.
      </h1>
      <div className="flex flex-col items-center justify-center space-y-3 mb-8 py-4 px-12 border border-brown/50 bg-brown/5">
        {isLoading ? (
          <p className="font-marcellus text-xl text-brown">
            <LucideLoader className="size-4 animate-spin" />
          </p>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <p className="font-marcellus text-xl text-creme">{user?.name}</p>
              {user?.labels.includes("admin") ? (
                <Badge variant="rtPrimary">Ex-Administrateur</Badge>
              ) : (
                <Badge variant="rtPrimary">Ex-Client</Badge>
              )}
            </div>
            <div className="h-[1px] w-full block bg-brown/50" />
            <p className="font-marcellus text-xl text-creme">{user?.email}</p>
          </>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          variant={"rtPrimary"}
          onClick={() => logout()}
          className="p-8 text-xl"
        >
          <LucideLogOut className="size-12 mr-2" />
          Se déconnecter
        </Button>
        <Button variant={"rtOutline"} className="p-8 text-xl" asChild>
          <Link
            href={"https://www.renaudtixier.com/en/contact"}
            target="_blank"
            title="Contact Page Renaud Tixier"
          >
            Contactez-nous
          </Link>
        </Button>
      </div>
    </>
  );
}

export default Banned;
