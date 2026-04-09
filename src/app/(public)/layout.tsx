import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-base font-bold text-gray-900">
              Round<span className="text-green-600">Drop</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/investors"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Investors
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
