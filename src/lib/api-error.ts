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

/**
 * Returns a user-facing error message. Use this for UI (notifications, error text).
 * - 5xx: generic message so we don't expose internal details.
 * - 4xx: first error from API when available (e.g. validation); otherwise generic.
 * The raw response is unchanged so Network tab still shows full API error for debugging.
 */
export function getDisplayErrorMessage(
  error: AxiosError<ApiErrorResponse> | null | undefined
): string {
  if (!error) return GENERIC_MESSAGE;
  const status = error.response?.status;
  const errors = error.response?.data?.errors;
  if (status != null && status >= 500) return GENERIC_MESSAGE;
  if (errors?.length) return errors[0];
  if (error.message) return error.message;
  return GENERIC_MESSAGE;
}
