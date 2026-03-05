import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your email and we'll send you a reset code.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}