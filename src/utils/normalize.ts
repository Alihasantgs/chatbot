/**
 * String normalization utilities
 */

/**
 * Normalizes email by trimming whitespace and converting to lowercase
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Trims whitespace from username
 */
export const normalizeUsername = (username: string): string => {
  return username.trim();
};

