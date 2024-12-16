"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { LoginSchema } from "../schemas";
import { useLogin } from "../api/use-login";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutate({ json: values });
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-marcellus text-creme text-xl text-center mb-8">
        Personal space
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="**********"
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
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <p>
        Don&apos;t have an account ?
        <Link href="/sign-up">
          <span className="text-blue-700">&nbsp;Sign Up</span>
        </Link>
      </p>
    </div>
  );
};
