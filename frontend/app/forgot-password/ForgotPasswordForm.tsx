"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/TextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { forgotPasswordAction } from "@/lib/actions/auth-actions";

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
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormData) => {
    setApiError(null);

    try {
      await forgotPasswordAction({ email: values.email });
      setSent(true);

      // Send user to reset screen with email prefilled
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (e: any) {
      setApiError(e?.message ?? "Failed to send reset code");
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

      {apiError && <p className="text-xs text-red-600">{apiError}</p>}
      {sent && <p className="text-xs text-emerald-600">Reset code sent. Check your email.</p>}

      <PrimaryButton disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset code"}
      </PrimaryButton>

      <div className="pt-2 text-center text-xs text-slate-600">
        <Link className="font-semibold text-blue-600 hover:underline" href="/login">
          Back to login
        </Link>
      </div>
    </form>
  );
}