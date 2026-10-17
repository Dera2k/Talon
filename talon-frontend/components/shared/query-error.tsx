import { Button } from "@/components/ui/button";

type QueryErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function QueryError({ message = "Something went wrong.", onRetry }: QueryErrorProps) {
  return (
    <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
