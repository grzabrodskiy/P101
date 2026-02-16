import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : "Unknown render error";
    return { hasError: true, message };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="app">
        <h1>Word Constructor</h1>
        <p className="status">Render error: {this.state.message}</p>
      </main>
    );
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

try {
  ReactDOM.createRoot(rootElement).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown startup error";
  rootElement.innerHTML = `<main style="padding:16px;font-family:Arial,sans-serif"><h1>Word Constructor</h1><p>Startup error: ${message}</p></main>`;
  // Keep this console log for local debugging.
  console.error(error);
}
