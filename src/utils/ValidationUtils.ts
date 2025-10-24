/**
 * Utility functions for input validation across the poker evaluation library.
 */

/**
 * Validates that a value is a non-empty array.
 *
 * @param value - Value to validate
 * @param paramName - Name of the parameter for error messages
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateArray(value: unknown, paramName: string): boolean {
  if (!Array.isArray(value)) {
    throw new Error(`${paramName} must be an array`);
  }
  if (value.length === 0) {
    throw new Error(`${paramName} cannot be empty`);
  }
  return true;
}

/**
 * Validates that a value is a positive integer within a specified range.
 *
 * @param value - Value to validate
 * @param paramName - Name of the parameter for error messages
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateInteger(value: unknown, paramName: string, min: number, max: number): boolean {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`${paramName} must be an integer`);
  }
  if (value < min || value > max) {
    throw new Error(`${paramName} must be between ${min} and ${max}`);
  }
  return true;
}

/**
 * Validates that a value is one of the allowed string values.
 *
 * @param value - Value to validate
 * @param paramName - Name of the parameter for error messages
 * @param allowedValues - Array of allowed string values
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateEnum(value: unknown, paramName: string, allowedValues: string[]): boolean {
  if (typeof value !== 'string') {
    throw new Error(`${paramName} must be a string`);
  }
  if (!allowedValues.includes(value)) {
    throw new Error(`${paramName} must be one of: ${allowedValues.join(', ')}`);
  }
  return true;
}

/**
 * Validates that all elements in an array are integers within a range.
 *
 * @param array - Array to validate
 * @param paramName - Name of the parameter for error messages
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateIntegerArray(
  array: unknown,
  paramName: string,
  min: number,
  max: number
): boolean {
  validateArray(array, paramName);

  const arr = array as number[];
  for (let i = 0; i < arr.length; i++) {
    validateInteger(arr[i], `${paramName}[${i}]`, min, max);
  }

  return true;
}

/**
 * Validates that an array has no duplicate values.
 *
 * @param array - Array to check for duplicates
 * @param paramName - Name of the parameter for error messages
 * @returns true if no duplicates found
 * @throws Error if duplicates found
 */
export function validateNoDuplicates(array: unknown[], paramName: string): boolean {
  const seen = new Set();
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (seen.has(value)) {
      throw new Error(`${paramName} contains duplicate value: ${value}`);
    }
    seen.add(value);
  }
  return true;
}

/**
 * Validates that an array has an exact length.
 *
 * @param array - Array to validate
 * @param paramName - Name of the parameter for error messages
 * @param expectedLength - Expected length of the array
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateExactLength(array: unknown, paramName: string, expectedLength: number): boolean {
  validateArray(array, paramName);

  const arr = array as unknown[];
  if (arr.length !== expectedLength) {
    throw new Error(`${paramName} must contain exactly ${expectedLength} elements`);
  }

  return true;
}

/**
 * Validates that an array length is within a range.
 *
 * @param array - Array to validate
 * @param paramName - Name of the parameter for error messages
 * @param minLength - Minimum allowed length (inclusive)
 * @param maxLength - Maximum allowed length (inclusive)
 * @returns true if valid
 * @throws Error if invalid
 */
export function validateLengthRange(
  array: unknown,
  paramName: string,
  minLength: number,
  maxLength: number
): boolean {
  validateArray(array, paramName);

  const arr = array as unknown[];
  if (arr.length < minLength || arr.length > maxLength) {
    throw new Error(`${paramName} must contain between ${minLength} and ${maxLength} elements`);
  }

  return true;
}
