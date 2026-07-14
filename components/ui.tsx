import { Palette } from "@/lib/theme";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </Card>
  );
}

type BadgeProps = {
  children: React.ReactNode;
  variant?: "mint" | "slate" | "danger";
};

export function Badge({ children, variant = "slate" }: BadgeProps) {
  const styles = {
    mint: `bg-[${Palette.mintSoft}] text-[${Palette.mint}]`,
    slate: "bg-border text-muted",
    danger: "bg-[rgba(229,72,77,0.15)] text-[var(--danger)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
      style={
        variant === "mint"
          ? { background: Palette.mintSoft, color: Palette.mint }
          : variant === "danger"
            ? { background: "rgba(229,72,77,0.15)", color: Palette.danger }
            : undefined
      }
    >
      {children}
    </span>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[var(--mint)] text-[var(--primary-text)] hover:opacity-90",
    secondary:
      "border border-border bg-card text-foreground hover:bg-border",
    danger:
      "bg-[var(--danger)] text-white hover:opacity-90",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-mint focus:ring-2 focus:ring-(--mint-soft) ${className}`}
      {...props}
    />
  );
}

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-foreground"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Signing out..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
