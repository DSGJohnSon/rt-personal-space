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
import { CalendarIcon, Loader, LucideHelpCircle } from "lucide-react";
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
import { countries } from "@/data/data";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
import { FlagComponent, PhoneInput } from "@/components/ui/phone-input";

export const RegisterWarrantyCard = () => {
  const { mutate, isPending } = useRegisterWarranty();

  const form = useForm<z.infer<typeof RegisterWarrantySchema>>({
    resolver: zodResolver(RegisterWarrantySchema),
    defaultValues: {
      civility: "mr",
      firstname: "",
      name: "",
      email: "",
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
                          <SelectTrigger variant={"rtPrimary"}>
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
                        variant={"rtPrimary"}
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
                        variant={"rtPrimary"}
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
                        variant={"rtPrimary"}
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
              <div className="space-y-1 w-full">
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhoneInput
                          onChange={(value) => field.onChange(value)}
                          value={field.value}
                          defaultCountry="CH"
                          international={true}
                          countryOptionsOrder={[
                            "CH",
                            "FR",
                            "CN",
                            "US",
                            "RU",
                            "JP",
                            "SG",
                            "AE",
                            "IT",
                            "DE",
                          ]}
                          placeholder="Phone number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          variant={"default"}
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
                        <SelectTrigger variant={"rtPrimary"}>
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
                              <FlagComponent
                                country={country.code}
                                countryName={country.name}
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
                      variant={"rtPrimary"}
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
                      variant={"rtPrimary"}
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
                        <SelectTrigger variant={"rtPrimary"}>
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
                              <FlagComponent
                                country={country.code}
                                countryName={country.name}
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
                          variant={"default"}
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
                      variant={"rtPrimary"}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel
                      htmlFor="terms"
                      className="text-creme cursor-pointer"
                      onClick={() => field.onChange(!field.value)}>
                      Terms & Conditions
                    </FormLabel>
                    <FormDescription
                      className="text-xs font-normal text-creme/80 cursor-pointer"
                      onClick={() => field.onChange(!field.value)}>
                      By checking this box, I hereby consent to the{" "}
                      <Link
                        href="https://www.renaudtixier.com/fr/legal"
                        target="_blank"
                        className="underline"
                        onClick={(e) => e.stopPropagation()}>
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
                      variant={"rtPrimary"}
                    />
                  </FormControl>
                  <div>
                    <FormLabel
                      htmlFor="purchaseDate"
                      className="text-creme cursor-pointer"
                      onClick={() => field.onChange(!field.value)}>
                      Request Warranty
                    </FormLabel>
                    <FormDescription
                      className="text-xs font-normal text-creme/80 cursor-pointer"
                      onClick={() => field.onChange(!field.value)}>
                      By checking this box, I request an additional three years
                      of warranty to complement the two years I currently have,
                      ensuring comprehensive coverage as specified in the{" "}
                      <Link
                        href="https://www.renaudtixier.com/fr/warranty"
                        target="_blank"
                        className="underline"
                        onClick={(e) => e.stopPropagation()}>
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
              variant={"rtPrimary"}
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
                "Register my warranty"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <p className="flex justify-between text-creme font-normal mt-8">
        Already have an account ?
        <Link href="/sign-in">
          <span className="text-brown underline">Sign In</span>
        </Link>
      </p>
    </div>
  );
};
