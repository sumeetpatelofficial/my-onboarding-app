"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOnboarding, saveOnboarding } from "@/lib/onboarding-storage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";
import { PhoneInputField } from "../ui/phone-input";
import { PersonalInfo, personalInfoSchema } from "@/lib/schemas";

export const PersonalForm = () => {
  const router = useRouter();
  const gender = ["male", "female", "others"];
  const onboarding = getOnboarding();

  const [showPassword, setShowPassword] = useState(false);
  const [pwStrength, setPwStrength] = useState<"weak" | "medium" | "strong">(
    "weak"
  );

  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: onboarding.personal || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      password: "",
    },
  });

  // ---------------- PASSWORD STRENGTH CHECKER ----------------
  const evaluatePasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score >= 4) return "strong";
    if (score >= 2) return "medium";
    return "weak";
  };

  // Watch password field
  const passwordValue = form.watch("password");
  useEffect(() => {
    setPwStrength(evaluatePasswordStrength(passwordValue || ""));
  }, [passwordValue]);

  // ---------------- SUBMIT ----------------
  const onSubmit = (values: PersonalInfo) => {
    saveOnboarding({ personal: values });
    router.push("/address");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 max-w-3xl"
      >
        {/* FIRST + LAST */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* EMAIL + PHONE */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PHONE AUTO FORMAT */}
          {/* <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    value={field.value}
                    placeholder="+91-12345 12345"
                    onChange={handlePhoneInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInputField
                    value={field.value}
                    onChange={(value: string) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* GENDER */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex justify-evenly gap-2"
                >
                  {gender.map((g) => (
                    <FormLabel
                      key={g}
                      htmlFor={"gender-" + g}
                      className="relative flex items-center w-full"
                    >
                      <RadioGroupItem
                        value={g}
                        id={"gender-" + g}
                        className="sr-only peer h-12"
                      />
                      <span className="px-4 py-2 rounded-sm border cursor-pointer peer-data-[state=checked]:bg-[#00C2FF] peer-data-[state=checked]:text-white text-sm w-full flex justify-center capitalize">
                        {g}
                      </span>
                    </FormLabel>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PASSWORD */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>

              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    {...field}
                  />
                </FormControl>

                {/* SHOW/HIDE ICON */}
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600" />
                  )}
                </span>
              </div>

              {/* PASSWORD STRENGTH METER */}
              <div className="mt-2 w-full h-1 bg-gray-200 rounded">
                <div
                  className={`h-1 rounded transition-all duration-300 ${
                    pwStrength === "weak"
                      ? "w-1/3 bg-red-500"
                      : pwStrength === "medium"
                      ? "w-2/3 bg-yellow-500"
                      : "w-full bg-green-500"
                  }`}
                ></div>
              </div>

              <p
                className={`text-sm mt-1 ${
                  pwStrength === "weak"
                    ? "text-red-500"
                    : pwStrength === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                Password strength: {pwStrength.toUpperCase()}
              </p>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={pwStrength !== "strong"}
          className={`px-8 h-12 rounded-sm font-semibold text-white 
            ${
              pwStrength === "strong"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Continue to address
        </Button>
      </form>
    </Form>
  );
};
