// Custom error classes for the application

export class ApiKeyNotConfiguredError extends Error {
  constructor(message: string = 'AI API key not configured. Please add your Gemini API key in Settings.') {
    super(message);
    this.name = 'ApiKeyNotConfiguredError';

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiKeyNotConfiguredError);
    }
  }
}

export class InvalidApiKeyError extends Error {
  constructor(message: string = 'Invalid API key. Please check your Gemini API key in Settings.') {
    super(message);
    this.name = 'InvalidApiKeyError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidApiKeyError);
    }
  }
}

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiRequestError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiRequestError);
    }
  }
}
