"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "@/components/ui";
import { AppLogo } from "@/components/AppLogo";
import { Palette } from "@/lib/theme";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/materials", label: "Materials" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/users", label: "Users" },
  { href: "/legal", label: "Legal" },
];

function NavLink({
  href,
  label,
  active,
  compact = false,
}: {
  href: string;
  label: string;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-xl font-medium transition ${
        compact ? "px-3 py-2 text-sm" : "block px-3 py-2 text-sm"
      } ${
        active
          ? "text-[var(--mint)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
      style={active ? { background: Palette.mintSoft } : undefined}
    >
      {label}
    </Link>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut, session } = useAuth();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);
  }

  async function handleConfirmSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      setShowSignOutConfirm(false);
    } catch {
      setSigningOut(false);
    }
  }

  useEffect(() => {
    if (!showSignOutConfirm) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !signingOut) {
        setShowSignOutConfirm(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showSignOutConfirm, signingOut]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <AppLogo size={36} className="h-8 w-8 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">
                Question Bank Admin
              </p>
              <p className="truncate text-xs text-[var(--muted)]">
                {session?.user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-[var(--muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)] sm:text-sm"
          >
            Sign out
          </button>
        </div>

        <nav className="border-t border-[var(--border)] md:hidden">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
                compact
              />
            ))}
          </div>
        </nav>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8 md:flex-row md:gap-8">
        <aside className="hidden w-44 shrink-0 md:block">
          <nav className="sticky top-28 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
              />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-6">{children}</main>
      </div>

      <ConfirmDialog
        open={showSignOutConfirm}
        title="Sign out?"
        message="You will need to sign in again to access the admin dashboard."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setShowSignOutConfirm(false)}
        loading={signingOut}
      />
    </div>
  );
}
