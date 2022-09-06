import React, { Component, FunctionComponent, ReactNode } from "react";
import { getLogger } from "../../utils/logger";

const { stack } = getLogger("component:errorBoundary");

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryRendererProps {
  error?: Error;
  recover: () => void;
}

export interface ErrorBoundaryProps {
  renderer: ErrorBoundaryRenderer;
  onError?: (error: Error) => void;
  onRecover?: () => void;
}

export type ErrorBoundaryRenderer = FunctionComponent<ErrorBoundaryRendererProps>;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    stack(error);
    const { onError } = this.props;
    if (onError) onError(error);
  }

  componentDidMount(): void {
    window.addEventListener("unhandledrejection", this.onUnhandledRejection);
  }

  componentWillUnmount(): void {
    window.removeEventListener("unhandledrejection", this.onUnhandledRejection);
  }

  onUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const { onError } = this.props;
    event.preventDefault();
    event.promise.catch(async (error) => {
      stack(error);
      this.setState(ErrorBoundary.getDerivedStateFromError(error), () => {
        if (onError) onError(error);
      });
    });
  };

  recover = (): void => {
    const { onRecover } = this.props;
    this.setState(
      {
        hasError: false,
        error: undefined,
      },
      () => {
        if (onRecover) onRecover();
      }
    );
  };

  render(): ReactNode {
    const error = this.state.error;
    const {
      recover,
      props: { renderer: ErrorRenderer },
    } = this;

    return this.state.hasError ? <ErrorRenderer error={error} recover={recover} /> : this.props.children;
  }
}
