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
  FormLabel,
} from "@/components/ui/form";
import Link from "next/link";
import { LoginSchema, RegisterWarrantySchema } from "../schemas";
import { useLogin } from "../api/use-login";
import { CalendarIcon, Check, Loader } from "lucide-react";
import TextSeparator from "@/components/text-separator";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { countries } from "@/data/data";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export const RegisterWarrantyCard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof RegisterWarrantySchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      civility: "mr",
      firstname: "",
      name: "",
      email: "",
      phoneIndex: "+33",
      phone: "",
      birthDate: undefined,
      country: "",
      password: "",
      serial: "",
      placeOfPurchase: "",
      purchaseDate: undefined,
      terms: false,
      requestWarranty: false,
    },
  });

  const [popoverPhoneIndexOpen, setPopoverPhoneIndexOpen] = useState(false);

  // const onSubmit = (values: z.infer<typeof LoginSchema>) => {
  //   mutate({ json: values });
  // };

  function onSubmit(data: z.infer<typeof RegisterWarrantySchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="flex flex-col w-full max-w-[600px]">
      <h1 className="font-marcellus text-creme font-bold text-4xl text-center mb-8">
        Welcome to the family !
      </h1>
      <TextSeparator label="Personal informations" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-2">
            <div className="space-y-1 w-full">
              <FormLabel className="text-creme">Civility</FormLabel>
              <FormField
                name="civility"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your civility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mr">Mr</SelectItem>
                          <SelectItem value="mrs">Mrs</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1 w-full">
              <FormLabel className="text-creme">First Name</FormLabel>
              <FormField
                name="firstname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1 w-full">
              <FormLabel className="text-creme">Last Name</FormLabel>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="space-y-1 w-full">
              <FormLabel className="text-creme">Email adress</FormLabel>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@doe.fr"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full space-y-1">
              <FormLabel htmlFor="phone" className="text-creme">
                Phone number
              </FormLabel>
              <div className="flex items-center">
                <div className="space-y-1 w-auto">
                  <FormField
                    control={form.control}
                    name="phoneIndex"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover open={popoverPhoneIndexOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="blank"
                                size={"blank"}
                                role="combobox"
                                className={cn(
                                  "flex items-center justify-between",
                                  "bg-transparent text-creme",
                                  "text-sm font-normal",
                                  "border border-r-0 border-brown",
                                  "p-3",
                                  !field.value && "text-muted-foreground"
                                )}
                                onClick={() => {
                                  setPopoverPhoneIndexOpen(true);
                                }}>
                                {field.value
                                  ? countries.find(
                                      (phoneIndex) =>
                                        phoneIndex.dial_code === field.value
                                    )?.dial_code
                                  : "Select your country code"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 delay-0">
                            <Command>
                              <CommandInput placeholder="Search phone index..." />
                              <CommandList>
                                <CommandEmpty>No indexes found.</CommandEmpty>
                                <CommandGroup>
                                  {countries.map((phoneIndex) => (
                                    <CommandItem
                                      value={phoneIndex.dial_code}
                                      key={phoneIndex.dial_code}
                                      onSelect={() => {
                                        form.setValue(
                                          "phoneIndex",
                                          phoneIndex.dial_code
                                        );
                                        setPopoverPhoneIndexOpen(false);
                                      }}>
                                      <span>({phoneIndex.dial_code})</span>
                                      {phoneIndex.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          phoneIndex.dial_code === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-1 w-full">
                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="x xx xx xx xx"
                            disabled={isPending}
                            onChange={(e) => {
                              form.setValue(
                                "phone",
                                e.target.value.replace(/\D/g, "")
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="space-y-1 w-full">
              <FormLabel className="text-creme">Email adress</FormLabel>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@doe.fr"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1 w-full">
              <FormLabel htmlFor="birthDate" className="text-creme">
                Date of birth
              </FormLabel>
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={field.value}
                          onSelect={field.onChange}
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <TextSeparator label="Personal informations" />
          <div className="space-y-1">
            <FormLabel className="text-creme">Password</FormLabel>
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
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <p className="flex justify-between text-creme font-normal mt-8">
        Don&apos;t have an account ?
        <Link href="/sign-up">
          <span className="text-brown underline">Sign In</span>
        </Link>
      </p>
    </div>
  );
};
