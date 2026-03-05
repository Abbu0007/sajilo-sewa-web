"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { resendVerificationAction, verifyEmailAction } from "@/lib/actions/auth-actions";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const schema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "OTP is required").max(8, "OTP is too long"),
});
type FormData = z.infer<typeof schema>;

export default function VerifyEmailForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialEmail = useMemo(() => sp.get("email") ?? "", [sp]);

  const [apiError, setApiError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: initialEmail, otp: "" },
  });

  const onSubmit = async (values: FormData) => {
    setApiError(null);
    setInfo(null);

    try {
      await verifyEmailAction({ email: values.email, otp: values.otp });
      setInfo("Email verified. You can now login.");
      router.replace("/login");
    } catch (e: any) {
      setApiError(e?.message ?? "Verification failed");
    }
  };

  const resend = async () => {
    const email = getValues("email");
    if (!email) {
      setApiError("Please enter your email first.");
      return;
    }

    setApiError(null);
    setInfo(null);
    setResending(true);

    try {
      await resendVerificationAction({ email });
      setInfo("Verification code sent. Check your email.");
    } catch (e: any) {
      setApiError(e?.message ?? "Failed to resend code");
    } finally {
      setResending(false);
    }
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
        label="Verification code (OTP)"
        placeholder="Enter OTP"
        type="text"
        error={errors.otp?.message}
        registration={register("otp")}
      />

      {apiError && <p className="text-xs text-red-600">{apiError}</p>}
      {info && <p className="text-xs text-emerald-600">{info}</p>}

      <PrimaryButton disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify email"}
      </PrimaryButton>

      <button
        type="button"
        onClick={resend}
        disabled={resending}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        {resending ? "Resending..." : "Resend code"}
      </button>

      <div className="pt-2 text-center text-xs text-slate-600">
        <Link className="font-semibold text-blue-600 hover:underline" href="/login">
          Back to login
        </Link>
      </div>
    </form>
  );
}