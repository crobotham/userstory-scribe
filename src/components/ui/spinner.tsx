
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-t-primary/20 border-r-primary/20 border-b-primary/20 border-l-primary",
        className
      )}
      {...props}
    />
  );
}
