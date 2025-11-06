/**
 * Error handling utilities for API responses
 */

interface ApiError {
  response?: {
    data?: {
      detail?: string | Array<{ msg?: string; message?: string }>;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Extracts user-friendly error message from API error response
 */
export const extractErrorMessage = (error: ApiError, defaultMessage: string): string => {
  const errorDetail = error.response?.data?.detail;

  if (errorDetail) {
    if (typeof errorDetail === 'string') {
      return errorDetail;
    }
    if (Array.isArray(errorDetail) && errorDetail.length > 0) {
      return errorDetail[0]?.msg || errorDetail[0]?.message || defaultMessage;
    }
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status === 404) {
    return 'Service not found. Please check your connection.';
  }

  if (error.response?.status && error.response.status >= 500) {
    return 'Server error. Please try again later.';
  }

  if (error.message && !error.message.includes('404') && !error.message.includes('Network')) {
    return error.message;
  }

  return defaultMessage;
};

