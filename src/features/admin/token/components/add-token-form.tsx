"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LucideInfo, LucidePlus, LucideTriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddNewAdminSchema } from "../schemas";
import { Separator } from "@/components/ui/separator";
import { useAddAdmin } from "../api/use-add-admin";

function AddTokenForm() {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);
  const form = useForm<z.infer<typeof AddNewAdminSchema>>({
    resolver: zodResolver(AddNewAdminSchema),
    defaultValues: {
      email: "",
    },
  });

  function formSuccessful() {
    form.reset();
    setSheetOpened(false);
  }

  const { mutate, isPending } = useAddAdmin({ formSuccessful });

  function onSubmit(values: z.infer<typeof AddNewAdminSchema>) {
    console.log(values);
    mutate({ json: values });
  }

  return (
    <>
      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent>
          <DialogHeader className="py-4">
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              Your form has unsaved changes that will be lost if you close it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-start w-full">
            <Button
              variant={"default"}
              onClick={() => {
                setDialogOpened(false);
              }}
              className="w-full">
              I changed my mind
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                setDialogOpened(false);
                setSheetOpened(false);
                form.resetField("email");
              }}>
              Don&apos;t save those changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet
        open={sheetOpened}
        onOpenChange={() => {
          if (sheetOpened && form.getValues("email") != "") {
            setDialogOpened(true);
            return;
          }
          setSheetOpened(!sheetOpened);
        }}>
        <SheetTrigger asChild>
          <Button>
            <LucidePlus className="size-3" />
            <span>Add New Admin</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add a new admin</SheetTitle>
            <SheetDescription>
              This action will generate a new token linked to an email. This
              token will be used to create the new admin account.
              <div className="bg-red-100 border border-red-300 text-red-600 p-4 mt-4 flex">
                <LucideTriangleAlert className="size-4 mr-1 inline" />
                <span className="w-[95%]">
                  Be ware of who you invite because it will have access to the
                  admin panel.
                </span>
              </div>
            </SheetDescription>
            <div className="py-4">
              <Separator />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@admin.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  Invite this admin
                </Button>
              </form>
            </Form>
            <SheetFooter>
              <div className="bg-slate-100 border border-slate-300 text-slate-600 p-4 my-4 flex">
                <LucideInfo className="size-4 mr-1 inline" />
                <span className="w-[95%]">
                  This new admin cannot use it&apos;s client email if he is a
                  client.
                </span>
              </div>
            </SheetFooter>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AddTokenForm;
