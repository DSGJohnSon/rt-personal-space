import { DataTableTokens } from "@/features/admin/token/components/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { columns } from "./columns";
import AddTokenForm from "@/features/admin/token/components/add-token-form";
import { getTokens } from "@/features/admin/token/action";
import { redirect } from "next/navigation";

async function Page() {

  return (
    <>
      <ScrollArea className="w-full h-full">
        <div className="flex items-center gap-2 mb-4">
          <AddTokenForm />
        </div>
        <DataTableTokens columns={columns} />
      </ScrollArea>
    </>
  );
}

export default Page;
