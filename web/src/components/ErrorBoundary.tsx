"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary catches React errors and displays a fallback UI
 * instead of crashing the entire app
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, send to error tracking service like Sentry)
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-zinc-900 border-2 border-red-600 p-8">
              <h1 className="text-3xl font-black text-red-500 mb-4">
                SOMETHING WENT WRONG
              </h1>
              <p className="text-zinc-400 font-medium mb-6">
                An unexpected error occurred. Please try refreshing the page.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-zinc-800 border-2 border-zinc-700 p-4 mb-6 overflow-auto">
                  <p className="text-xs text-red-400 font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-black hover:bg-blue-500 transition"
                >
                  RELOAD PAGE
                </button>
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  className="flex-1 px-6 py-3 bg-zinc-700 text-white font-black hover:bg-zinc-600 transition"
                >
                  GO HOME
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
