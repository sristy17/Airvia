/**
 * Trims leading and trailing whitespace from a string.
 *
 * If the input is undefined or falsy, it returns the value as-is.
 *
 * @param {string | undefined} value - The string to be trimmed
 * @returns {string | undefined} - Trimmed string or original value if undefined
 */

export const trimString = (value?: string) => {
  return value ? value.trim() : value;
};