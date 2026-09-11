import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "cn";

// Modal styling per ui-design-system-specification.md §8.3: radius-lg,
// color-surface, dimmed backdrop. Regular Dialog (not AlertDialog) so
// Escape/backdrop-click still dismiss even for destructive confirmations —
// only the confirm action itself should be hard to trigger by accident.
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogBackdrop({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: DialogPrimitive.Popup.Props & { showClose?: boolean }) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogClose className="absolute top-4 right-4 rounded-md p-1 text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary">
            <X size={16} aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogClose>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn("text-h3 font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-1.5 text-small text-text-secondary", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
