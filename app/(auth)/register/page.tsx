import AuthShell from "../_components/AuthShell";
import RegisterForm from "../_components/RegisterForm";
import FeatureTiles from "../_components/FeatureTiles";

function HomeBadgeIcon() {
  return (
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell
      reverseOnMobile
      left={
        <div className="space-y-1">
          <HomeBadgeIcon />
          <h1 className="mt-4 text-center text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-center text-sm text-slate-600">
            Join thousands of happy customers
          </p>
          <RegisterForm />
        </div>
      }
      rightImageSrc="/register_form.png"
      rightTitle="Join Sajilo Sewa Today"
      rightSubtitle="Start your journey with Nepal's most trusted home service platform. Book services or become a service provider."
      footerBlocks={<FeatureTiles />}
    />
  );
}
