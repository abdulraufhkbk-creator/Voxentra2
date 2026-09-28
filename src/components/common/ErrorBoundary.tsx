import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home, Sparkles } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside Voxentra ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-8">
          <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/80 shadow-lg space-y-6 w-full">
            <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center mx-auto shadow-md">
              <AlertOctagon size={28} className="text-amber-500" />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#7D786F]">
                VOXENTRA FAULT PROTECTION
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                {this.props.fallbackTitle || 'Rendering Exception Caught Gracefully'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5E5A54] leading-relaxed max-w-md mx-auto">
                An unexpected component rendering issue occurred in this section. The rest of the Voxentra system remains fully operational and protected.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-white/80 border border-[#D8CFC2] p-4 rounded-2xl text-left text-xs font-mono text-[#111111] overflow-x-auto max-h-36 shadow-inner space-y-1">
                <div className="font-bold text-rose-700 text-[11px]">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] text-[#5E5A54] leading-normal whitespace-pre-wrap pt-1 border-t border-[#D8CFC2]/50">
                    {this.state.errorInfo.componentStack.trim()}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Retry View</span>
              </button>

              <button
                onClick={() => {
                  this.handleReset();
                  window.location.hash = '#home';
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 hover:bg-white text-[#111111] font-bold text-xs border border-[#D8CFC2] transition-all shadow-2xs cursor-pointer"
              >
                <Home size={14} />
                <span>Return to Executive Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
