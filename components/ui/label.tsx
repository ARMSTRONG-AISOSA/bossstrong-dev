import { cn } from "cn";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-small font-medium text-text-primary select-none",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
