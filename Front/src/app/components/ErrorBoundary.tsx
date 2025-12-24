import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean; error?: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 text-center text-red-600" dir="rtl">
          <h2 className="text-lg font-bold mb-2">خطا در نمایش صفحه مدیریت</h2>
          <div className="whitespace-pre-wrap">{String(this.state.error)}</div>
        </div>
      );
    }

    return this.props.children as any;
  }
}
