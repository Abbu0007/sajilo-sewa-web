"use client";

type Props = {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  registration: any;
};

export default function TextInput({
  label,
  placeholder,
  type = "text",
  error,
  leftIcon,
  rightIcon,
  registration,
}: Props) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>


      <div
        className={[
          "flex items-center gap-2 rounded-lg border bg-white px-3 py-2",
          error ? "border-red-500" : "border-slate-200",
          "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100",
        ].join(" ")}
      >
        {leftIcon ? <span className="text-slate-400">{leftIcon}</span> : null}

        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          {...registration}
        />

        {rightIcon ? <span className="text-slate-400">{rightIcon}</span> : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
