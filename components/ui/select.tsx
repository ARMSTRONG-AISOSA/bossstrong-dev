import { cn } from "cn";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-body text-text-primary outline-none transition-colors focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
