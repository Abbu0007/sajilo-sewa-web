export default function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium hover:bg-slate-50"
      >
        <span className="text-red-500 font-bold">G</span>
        Google
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium hover:bg-slate-50"
      >
        <span className="text-blue-600 font-bold">f</span>
        Facebook
      </button>
    </div>
  );
}
