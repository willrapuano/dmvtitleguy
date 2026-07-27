"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-brand-navy mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but there was an error loading this page. Please try refreshing or contact us if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-action text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="mt-6 text-left text-xs bg-gray-100 p-4 rounded overflow-auto">
                {this.state.error.message}
                {"\n"}
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
