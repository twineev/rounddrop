import Link from "next/link";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo banner */}
      <div
        className="text-white px-4 py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: "linear-gradient(90deg, #E8C026, #50C878)" }}
      >
        <span>🎬 Demo mode — every action is mocked. No data is saved.</span>
        <Link href="/sign-up" className="rounded-md bg-white/95 px-3 py-1 text-[11px] font-extrabold" style={{ color: "#0F1A2E" }}>
          Sign up free →
        </Link>
        <Link href="/" className="text-white/90 underline underline-offset-2">
          Back to home
        </Link>
      </div>
      {children}
    </div>
  );
}
