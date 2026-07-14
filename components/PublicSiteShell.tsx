import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";

export function PublicSiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/privacy" className="flex items-center gap-3">
            <AppLogo size={36} />
            <span className="font-semibold">Question Bank</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              Terms
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
