import type { AxiosError } from 'axios';

const GENERIC_MESSAGE =
  'Something went wrong. Please try again or contact the administrator.';

/**
 * API error response shape (from main-api HttpExceptionFilter).
 * Full details are always in the response for debugging (Network tab).
 */
export interface ApiErrorResponse {
  errors?: string[];
  stack?: string;
}

/** Type guard for axios-like error with response.data.errors */
function isAxiosErrorLike(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (
    typeof error === 'object' &&
    error != null &&
    'response' in error &&
    typeof (error as AxiosError<ApiErrorResponse>).response?.data === 'object'
  );
}

/**
 * Returns a user-facing error message. Use this for UI (notifications, error text).
 * Accepts unknown so it can be used from mutation onError and query error.
 * - 5xx: generic message so we don't expose internal details.
 * - 4xx: first error from API when available (e.g. validation); otherwise generic.
 */
export function getDisplayErrorMessage(error: unknown): string {
  if (error == null) return GENERIC_MESSAGE;
  if (!isAxiosErrorLike(error)) {
    if (error instanceof Error && error.message) return error.message;
    return GENERIC_MESSAGE;
  }
  const status = error.response?.status;
  const errors = error.response?.data?.errors;
  if (status != null && status >= 500) return GENERIC_MESSAGE;
  if (errors?.length) return errors[0];
  if (error.message) return error.message;
  return GENERIC_MESSAGE;
}
