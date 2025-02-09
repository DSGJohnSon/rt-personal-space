"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RegisterAdminSchema } from "../schemas";
import { Loader, LucideTriangleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRegisterAdmin } from "../api/use-register-admin";

type RegisterAdminFormValues = z.infer<typeof RegisterAdminSchema>;

export const RegisterAdminCard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, isPending } = useRegisterAdmin();

  const form = useForm<z.infer<typeof RegisterAdminSchema>>({
    resolver: zodResolver(RegisterAdminSchema),
    defaultValues: {
      token: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterAdminSchema>) => {
    mutate({ json: values });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterAdminForm
        form={form}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Suspense>
  );
};

const RegisterAdminForm = ({
  form,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<RegisterAdminFormValues>;
  isPending: boolean;
  onSubmit: (values: z.infer<typeof RegisterAdminSchema>) => void;
}) => {
  //récupérer le token contenu dans l'url sous la forme : url?token=token
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  if (!token || !emailParam) redirect("/");
  form.setValue("token", token);
  form.setValue("email", emailParam);

  return (
    <div className="flex flex-col w-full max-w-[480px]">
      <h1 className="font-marcellus text-creme font-bold text-4xl text-center mb-8">
        Register your admin account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-creme">Token</Label>
            <FormField
              name="token"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      disabled={true}
                      variant={"rtPrimary"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="bg-brown/5 border border-brown/50 p-4 flex items-center">
              <LucideTriangleAlert className="mr-2 text-brown size-4" />
              <div className="flex flex-col">
                <p className="text-brown text-xs">
                  This token is unique and can only be used once.
                </p>
                <p className="text-brown text-xs">
                  It has been generated for your mail only.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-creme">Full Name</Label>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John"
                      disabled={isPending}
                      variant={"rtPrimary"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-creme">Email</Label>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="mail@mail.com"
                      disabled={true}
                      variant={"rtPrimary"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-creme">Password</Label>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••••"
                      disabled={isPending}
                      variant={"rtPrimary"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            variant={"rtPrimary"}
            size={"lg"}
            disabled={isPending}
            className="w-full">
            {isPending ? (
              <>
                <Loader className="mr-2 size-5 animate-spin" />
                Please wait...
              </>
            ) : (
              "Register as Admin"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
