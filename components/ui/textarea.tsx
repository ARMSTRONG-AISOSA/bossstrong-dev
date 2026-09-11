import { cn } from "cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-text-primary outline-none transition-colors placeholder:text-text-secondary focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
