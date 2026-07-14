import type { LegalDocument } from "@/lib/legal";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {document.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Last updated {document.lastUpdated}
        </p>
      </header>

      <p className="text-base leading-7 text-[var(--foreground)]">
        {document.intro}
      </p>

      <div className="mt-8 space-y-8">
        {document.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-sm leading-7 text-[var(--muted)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
