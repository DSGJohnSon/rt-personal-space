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
import { useLogin } from "../api/use-login";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type RegisterAdminFormValues = z.infer<typeof RegisterAdminSchema>;

export const RegisterAdminCard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, isPending } = useLogin();

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
    // mutate({ json: values });
    console.log(values);
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
  if (!token) redirect("/");
  form.setValue("token", token);

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
                    <Input {...field} type="text" disabled={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-creme">First Name</Label>
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
                      disabled={isPending}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            variant={"primary"}
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
