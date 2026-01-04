"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterValues } from "@/lib/validators/auth";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Link from "next/link";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2h4l2 5-3 2c1 3 4 6 7 7l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 4c0-1 1-2 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" />
      <path d="M6 11h12v10H6V11Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function RegisterForm() {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "book",
      profession: "",
      agree: false,
    },
  });

  
  const [roleUI, setRoleUI] = useState<"book" | "provide">("book");

  useEffect(() => {
    const initial = getValues("role");
    setRoleUI(initial === "provide" ? "provide" : "book");
  }, [getValues]);

  const setRole = (value: "book" | "provide") => {

    setRoleUI(value);

    setValue("role", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (value === "book") {
      setValue("profession", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const roleBtn = (value: "book" | "provide", label: string) => {
    const active = roleUI === value;
    return (
      <button
        type="button"
        onClick={() => setRole(value)}
        className={[
          "flex-1 rounded-lg border px-3 py-2 text-xs font-medium",
          active
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-700",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  const onSubmit = async (values: RegisterValues) => {
    console.log("REGISTER:", values);
    alert("Account created (dummy). Now you can login.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <input type="hidden" {...register("role")} />

      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="First Name"
          placeholder="First name"
          error={errors.firstName?.message}
          registration={register("firstName")}
        />
        <TextInput
          label="Last Name"
          placeholder="Last name"
          error={errors.lastName?.message}
          registration={register("lastName")}
        />
      </div>

      <TextInput
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        leftIcon={<MailIcon />}
        error={errors.email?.message}
        registration={register("email")}
      />

      <TextInput
        label="Phone Number"
        placeholder="98XXXXXXXX (10 digits)"
        leftIcon={<PhoneIcon />}
        error={errors.phone?.message}
        registration={register("phone")}
      />

      <TextInput
        label="Password"
        placeholder="Min 7 chars, 1 capital, 1 number, 1 special"
        type="password"
        leftIcon={<LockIcon />}
        error={errors.password?.message}
        registration={register("password")}
      />

      <TextInput
        label="Confirm Password"
        placeholder="Confirm password"
        type="password"
        leftIcon={<LockIcon />}
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700">I want to</p>
        <div className="flex gap-3">
          {roleBtn("book", "Book Services")}
          {roleBtn("provide", "Provide Services")}
        </div>
      </div>

      {roleUI === "provide" && (
        <TextInput
          label="Profession"
          placeholder="e.g. Plumber, Electrician, Cleaner"
          error={errors.profession?.message}
          registration={register("profession")}
        />
      )}

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" className="mt-0.5 h-3.5 w-3.5" {...register("agree")} />
        <span>
          I agree to the{" "}
          <span className="text-blue-600 underline">Terms of Service</span> and{" "}
          <span className="text-blue-600 underline">Privacy Policy</span>
        </span>
      </label>

      {errors.agree?.message && <p className="text-xs text-red-600">{errors.agree.message}</p>}

      <PrimaryButton disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Account"}
      </PrimaryButton>

      <div className="pt-3 text-center text-xs text-slate-600">
        Already have an account?
        <div className="mt-2">
          <Link className="font-semibold text-blue-600 hover:underline" href="/login">
            Sign in here
          </Link>
        </div>
      </div>
    </form>
  );
}
