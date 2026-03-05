"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { resetPasswordAction } from "@/lib/actions/auth-actions";

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

const schema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "OTP is required").max(8, "OTP is too long"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialEmail = useMemo(() => sp.get("email") ?? "", [sp]);

  const [apiError, setApiError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: initialEmail, otp: "", newPassword: "" },
  });

  const onSubmit = async (values: FormData) => {
    setApiError(null);

    try {
      await resetPasswordAction({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });

      setDone(true);
      router.replace("/login");
    } catch (e: any) {
      setApiError(e?.message ?? "Failed to reset password");
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
        label="Reset code (OTP)"
        placeholder="Enter OTP"
        type="text"
        error={errors.otp?.message}
        registration={register("otp")}
      />

      <TextInput
        label="New Password"
        placeholder="Enter new password"
        type="password"
        leftIcon={<LockIcon />}
        error={errors.newPassword?.message}
        registration={register("newPassword")}
      />

      {apiError && <p className="text-xs text-red-600">{apiError}</p>}
      {done && <p className="text-xs text-emerald-600">Password updated. Redirecting...</p>}

      <PrimaryButton disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Reset password"}
      </PrimaryButton>

      <div className="pt-2 text-center text-xs text-slate-600">
        <Link className="font-semibold text-blue-600 hover:underline" href="/login">
          Back to login
        </Link>
      </div>
    </form>
  );
}