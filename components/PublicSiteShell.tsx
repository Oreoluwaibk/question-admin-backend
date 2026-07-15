import { AppLogo } from "@/components/AppLogo";
import { MARKETING_LINKS } from "@/lib/site";

export function PublicSiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a
            href={MARKETING_LINKS.home}
            className="flex items-center gap-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppLogo size={36} />
            <span className="font-semibold">Question Bank</span>
          </a>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href={MARKETING_LINKS.privacy}
              className="text-muted transition hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
            <a
              href={MARKETING_LINKS.deleteAccount}
              className="text-muted transition hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Delete account
            </a>
            <a
              href={MARKETING_LINKS.terms}
              className="text-muted transition hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
