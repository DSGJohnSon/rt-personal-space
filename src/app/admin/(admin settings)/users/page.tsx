import { DataTable } from "@/components/ui/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { UserAdmin, columns } from "./columns";

async function getData(): Promise<UserAdmin[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      createdAt: new Date("2021-09-01"),
      updatedAt: new Date("2021-09-01"),
      status: "invited",
      email: "fred.florkowski@outlook.fr",
      token: "token1",
    },
    {
      id: "728ed52f",
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2022-01-01"),
      status: "banned",
      email: "fred.florkowski@outlook.fr",
      token: "token1",
    },
    {
      id: "728ed52f",
      createdAt: new Date("2024-04-01"),
      updatedAt: new Date("2024-04-01"),
      status: "registered",
      email: "fred.florkowski@outlook.fr",
      token: "token1",
    },
  ];
}

async function Page() {
  const data = await getData();

  return (
    <>
      <ScrollArea className="w-full h-full">
        <DataTable columns={columns} data={data} />
      </ScrollArea>
    </>
  );
}

export default Page;
