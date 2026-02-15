import * as Sentry from '@sentry/nextjs';

/**
 * Sentry Client Configuration
 * Error tracking and performance monitoring
 */

Sentry.init({
  // Disable in development
  enabled: process.env.NODE_ENV === 'production',
  
  // Production DSN - replace with your actual Sentry DSN
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  // Filter events
  beforeSend(event, hint) {
    // Filter out certain errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
  
  // Ignore certain errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    /loading chunk \d+ failed/i,
  ],
  
  // Spotlight (local development debugging)
  spotlight: process.env.NODE_ENV === 'development',
});
