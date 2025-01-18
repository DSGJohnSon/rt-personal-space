"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  LucideArrowUpDown,
  LucideBan,
  LucideClipboard,
  LucideCopy,
  LucideMoreHorizontal,
  LucideRefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { sucessMessages } from "@/data/data";
import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBanAdmin } from "@/features/admin/token/api/use-ban-admin";
import { useCurrent } from "@/features/auth/api/use-current";
import { useUnbanAdmin } from "@/features/admin/token/api/use-unban-admin";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserAdmin = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: "invited" | "registered" | "banned";
  email: string;
};

export const columns: ColumnDef<UserAdmin>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-slate-900 hover:cursor-pointer"
        >
          Status
          <LucideArrowUpDown className="h-4 w-4 mb-0.5" />
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (typeof status === "string") {
        const formatted = status.charAt(0).toUpperCase() + status.slice(1);
        let variant: BadgeProps["variant"];
        switch (status) {
          case "invited":
            variant = "pending";
            break;
          case "registered":
            variant = "registered";
            break;
          case "banned":
            variant = "destructive";
            break;

          default:
            variant = "default";
            break;
        }
        return (
          <Badge
            variant={variant}
            className="text-left font-medium cursor-default"
          >
            {formatted}
          </Badge>
        );
      }
      return <div className="text-left font-medium">Unknown</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-slate-900 hover:cursor-pointer"
        >
          Email
          <LucideArrowUpDown className="h-4 w-4 mb-0.5" />
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-slate-900 hover:cursor-pointer"
        >
          Token
          <LucideArrowUpDown className="h-4 w-4 mb-0.5" />
        </div>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const email = row.getValue("email") as string;

      return (
        <div className="flex items-center gap-2">
          {id}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <LucideClipboard
                  className="size-3 pb-0.5 text-slate-400 hover:text-slate-900 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env
                        .NEXT_PUBLIC_APP_URL!}/admin-sign-up?token=${id}&email=${email}`
                    );
                    const traductedSucessMessage = sucessMessages.find(
                      (item) => item.code === "link_copied"
                    );
                    if (!traductedSucessMessage) {
                      toast.success("link_copied"); //afficher le message par défaut
                    } else {
                      toast.success(traductedSucessMessage.en);
                    }
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Register Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-slate-900 hover:cursor-pointer"
        >
          Created at
          <LucideArrowUpDown className="h-4 w-4 mb-0.5" />
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(createdAt);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-slate-900 hover:cursor-pointer"
        >
          Updated at
          <LucideArrowUpDown className="h-4 w-4 mb-0.5" />
        </div>
      );
    },
    cell: ({ row }) => {
      const updatedAt = new Date(row.getValue("updatedAt"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(updatedAt);

      return <div className="text-left font-medium opacity-50">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowFocused = row.original;
      const user = useCurrent();
      const banAdminMutation = useBanAdmin(rowFocused.id);
      const unbanAdminMutation = useUnbanAdmin(rowFocused.id);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LucideMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {rowFocused.status === "invited" && (
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_APP_URL!}/admin-sign-up?token=${
                      rowFocused.id
                    }`
                  );
                  const traductedSucessMessage = sucessMessages.find(
                    (item) => item.code === "link_copied"
                  );
                  if (!traductedSucessMessage) {
                    toast.success("link_copied"); // afficher le message par défaut
                  } else {
                    toast.success(traductedSucessMessage.en); // afficher le message de succès personnalisé
                  }
                }}
                className="cursor-pointer"
              >
                <LucideCopy className="h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
            )}
            {(rowFocused.status === "invited" ||
              rowFocused.status === "registered") && (
              <DropdownMenuItem
                onClick={() => {
                  // Appeler la mutation directement
                  banAdminMutation.mutate({
                    json: {
                      token: rowFocused.id, // Passer le token ici
                    },
                  });
                }}
                disabled={user.data?.email === rowFocused.email}
                className="cursor-pointer"
              >
                <LucideBan className="h-4 w-4" />
                Disable / Ban
              </DropdownMenuItem>
            )}
            {rowFocused.status === "banned" && (
              <DropdownMenuItem
                onClick={() => {
                  // Appeler la mutation directement
                  unbanAdminMutation.mutate({
                    json: {
                      token: rowFocused.id, // Passer le token ici
                    },
                  });
                }}
                disabled={user.data?.email === rowFocused.email}
                className="cursor-pointer"
              >
                <LucideRefreshCw className="h-4 w-4" />
                De-Ban / Enable
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
