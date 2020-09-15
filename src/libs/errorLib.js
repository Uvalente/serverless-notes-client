import * as Sentry from "@sentry/react";

const isLocal = process.env.NODE_ENV === "development";

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({ dsn: "https://b2b7ed70c1c949e68b9861e15a88437f@o448403.ingest.sentry.io/5429733" });
}

export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}


export function onError(error) {
  let errorInfo = {}
  let message = error.toString()

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    errorInfo = error
    message = error.message
    error = new Error(message)
    // API errors
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url
  }

  logError(error, errorInfo)

  alert(message)
}