import VerifyEmailForm from "./VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the code sent to your email. You can resend if it expires.
      </p>
      <VerifyEmailForm />
    </div>
  );
}