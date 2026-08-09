import type { ReactNode } from "react";

export interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export type FallbackComponent = React.ComponentType<ErrorFallbackProps>;

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: FallbackComponent;
}

export interface ErrorBoundaryState {
  error: Error | null;
}
