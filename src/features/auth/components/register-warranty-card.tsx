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
  FormDescription,
} from "@/components/ui/form";
import Link from "next/link";
import { RegisterWarrantySchema } from "../schemas";
import { CalendarIcon, Check, Loader, LucideHelpCircle } from "lucide-react";
import TextSeparator from "@/components/text-separator";
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
import Image from "next/image";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HowToFindSerial from "./other/how-to-find-serial";
import { useRegisterWarranty } from "../api/use-register-warranty";
import { Checkbox } from "@/components/ui/checkbox";

export const RegisterWarrantyCard = () => {
  const { mutate, isPending } = useRegisterWarranty();

  const form = useForm<z.infer<typeof RegisterWarrantySchema>>({
    resolver: zodResolver(RegisterWarrantySchema),
    defaultValues: {
      civility: "mr",
      firstname: "",
      name: "",
      email: "",
      phoneIndex: "+41",
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

  const onSubmit = (values: z.infer<typeof RegisterWarrantySchema>) => {
    mutate({ json: values });
  };

  return (
    <div className="flex flex-col w-full max-w-[600px] py-32">
      <h1 className="font-marcellus text-creme font-bold text-4xl text-center mb-8">
        Welcome to the family !
      </h1>
      <TextSeparator label="Personal informations" className="py-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-4">
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
                                <span>
                                  {field.value
                                    ? countries.find(
                                        (phoneIndex) =>
                                          phoneIndex.dial_code === field.value
                                      )?.dial_code
                                    : "Select your country code"}
                                </span>
                                <CaretSortIcon className="text-brown" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 delay-0">
                            <Command>
                              <CommandInput placeholder="Search phone index..." />
                              <CommandList>
                                <CommandEmpty>No indexes found.</CommandEmpty>
                                <CommandGroup>
                                  {countries.map((phoneIndex, index) => (
                                    <CommandItem
                                      value={phoneIndex.name}
                                      key={phoneIndex.dial_code + index}
                                      onSelect={() => {
                                        form.setValue(
                                          "phoneIndex",
                                          phoneIndex.dial_code
                                        );
                                        setPopoverPhoneIndexOpen(false);
                                      }}>
                                      <Image
                                        src={`https://flagcdn.com/${phoneIndex.code.toLowerCase()}.svg`}
                                        width={0}
                                        height={0}
                                        alt={`${phoneIndex.name} flag`}
                                        style={{
                                          width: "20px",
                                          height: "auto",
                                        }}
                                      />
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
                          variant={"input"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-creme/30"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-brown" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        autoFocus
                        startMonth={new Date(1900, 1)}
                        endMonth={new Date(2025, 2)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1 w-full">
            <FormLabel htmlFor="placeOfPurchase" className="text-creme">
              Living Country
            </FormLabel>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select your country"
                            className={"placeholder:text-red-600"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem value={country.name} key={country.code}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                width={0}
                                height={0}
                                alt={`${country.name} flag`}
                                style={{
                                  width: "20px",
                                  height: "auto",
                                }}
                              />
                              {country.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
          <TextSeparator label="About your watch" className="py-4" />
          <div className="space-y-1 w-full">
            <div className="flex items-center gap-2 w-full justify-between">
              <FormLabel className="text-creme">Serial Number</FormLabel>
              <Dialog>
                <DialogTrigger className="flex items-center gap-2 text-creme/30 text-xs hover:underline">
                  <span>How to find my serial ?</span>
                  <LucideHelpCircle size={14} className="mb-0.5" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-normal">
                      How to find my serial number ?
                    </DialogTitle>
                    <DialogDescription>
                      <HowToFindSerial />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <FormField
              name="serial"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="XXXXX"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1 w-full">
            <FormLabel htmlFor="placeOfPurchase" className="text-creme">
              Place of Purchase
            </FormLabel>
            <FormField
              control={form.control}
              name="placeOfPurchase"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select your country"
                            className={"placeholder:text-red-600"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.slice(0, 10).map((country) => (
                          <SelectItem value={country.name} key={country.code}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                width="20"
                                height="20"
                                alt={`${country.name} flag`}
                              />
                              {country.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1 w-full">
            <FormLabel htmlFor="purchaseDate" className="text-creme">
              Date of purchase
            </FormLabel>
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"input"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-creme/30"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-brown" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        autoFocus
                        startMonth={new Date(2024, 1)}
                        endMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1 w-full pt-2">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel htmlFor="purchaseDate" className="text-creme">
                      Terms & Conditions
                    </FormLabel>
                    <FormDescription className="text-xs font-normal text-creme/80">
                      By checking this box, I hereby consent to the{" "}
                      <Link href="/examples/forms" className="underline">
                        Terms and Conditions
                      </Link>{" "}
                      and authorize RENAUD TIXIER to send me engaging
                      information, exclusive updates, and notifications
                      regarding new releases.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1 w-full pt-2">
            <FormField
              control={form.control}
              name="requestWarranty"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel htmlFor="purchaseDate" className="text-creme">
                      Request Warranty
                    </FormLabel>
                    <FormDescription className="text-xs font-normal text-creme/80">
                      By checking this box, I request an additional three years
                      of warranty to complement the two years I currently have,
                      ensuring comprehensive coverage as specified in the{" "}
                      <Link href="/examples/forms" className="underline">
                        Warranty Conditions
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              variant={"primary"}
              size={"lg"}
              disabled={isPending}
              className="w-full mt-4"
              type="submit">
              {isPending ? (
                <>
                  <Loader className="mr-2 size-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
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
