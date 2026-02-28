import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App error caught by boundary:', error, info);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
    window.location.hash = '#setup';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-8 text-center"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-white font-black text-2xl mb-2">Something went wrong</h1>
          <p className="text-white/50 text-sm mb-8">Don't worry — tap below to get back in the game.</p>
          <button
            onClick={this.handleRestart}
            className="px-8 py-4 rounded-2xl bg-[#3b82f6] text-white font-black text-lg"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            Restart App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}