import React, { Component, type ErrorInfo } from "react";

import { DefaultErrorScreen } from "./DefaultErrorScreen";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "./type";

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) {
      const FallbackComponent =
        this.props.fallbackComponent ?? DefaultErrorScreen;

      return <FallbackComponent error={error} reset={this.reset} />;
    }

    return this.props.children;
  }
}
