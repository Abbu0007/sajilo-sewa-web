"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "@/lib/validators/auth";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SocialButtons from "./SocialButtons";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* Icons */
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
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
function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12s4-7 10-7c2.2 0 4.1.7 5.7 1.7M22 12s-4 7-10 7c-2.2 0-4.1-.7-5.7-1.7" stroke="currentColor" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values: LoginValues) => {
    console.log("LOGIN:", values);
    router.push("/auth/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <TextInput
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        leftIcon={<MailIcon />}
        error={errors.email?.message}
        registration={register("email")}
      />

      <TextInput
        label="Password"
        placeholder="Enter your password"
        type={showPw ? "text" : "password"}
        leftIcon={<LockIcon />}
        rightIcon={
          <button type="button" onClick={() => setShowPw((v) => !v)}>
            <EyeIcon open={showPw} />
          </button>
        }
        error={errors.password?.message}
        registration={register("password")}
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-600">
          <input type="checkbox" className="h-3.5 w-3.5" {...register("remember")} />
          Remember me
        </label>

        <button type="button" className="font-medium text-blue-600 hover:underline">
          Forgot password?
        </button>
      </div>

      <PrimaryButton disabled={isSubmitting}>
        {isSubmitting ? "Signing In..." : "Sign In"}
      </PrimaryButton>

      <div className="py-2 text-center text-xs text-slate-400">Or continue with</div>
      <SocialButtons />

      <div className="pt-4 text-center text-xs text-slate-600">
        Don&apos;t have an account?
        <div className="mt-2">
          <Link className="font-semibold text-blue-600 hover:underline" href="/register">
            Sign up here
          </Link>
        </div>
      </div>
    </form>
  );
}
