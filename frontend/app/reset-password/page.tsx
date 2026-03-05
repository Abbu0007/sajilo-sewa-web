import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the code you received and set a new password.
      </p>
      <ResetPasswordForm />
    </div>
  );
}