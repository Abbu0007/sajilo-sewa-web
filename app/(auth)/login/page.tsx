import AuthShell from "../_components/AuthShell";
import LoginForm from "../_components/LoginForm";
import StatsStrip from "../_components/StatsStrip";

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

export default function LoginPage() {
  return (
    <AuthShell
      left={
        <div className="space-y-1">
          <HomeBadgeIcon />
          <h1 className="mt-4 text-center text-2xl font-bold">Sajilo Sewa</h1>
          <p className="mt-1 text-center text-sm text-slate-600">
            Welcome back! Please sign in to your account
          </p>
          <LoginForm />
        </div>
      }
      rightImageSrc="/home-services.png"
      rightTitle="Your Home Services, Simplified"
      rightSubtitle="Connect with trusted professionals for all your home service needs. From cleaning to repairs, we've got you covered."
      stats={<StatsStrip />}
    />
  );
}
