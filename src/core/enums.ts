/**
 * Enum representing gender values.
 *
 * Used to standardize gender representation across the system.
 *
 * @enum {string}
 * @property {string} MALE - Male ("M")
 * @property {string} FEMALE - Female ("F")
 * @property {string} OTHER - Other / Non-binary ("O")
 */

export enum GENDER {
  MALE = "M",
  FEMALE = "F",
  OTHER = "O"
}

/**
 * Enum representing booking status values.
 *
 * Used to track the lifecycle of a booking.
 *
 * @enum {string}
 * @property {string} CONFIRMED - Booking is confirmed
 * @property {string} CANCELLED - Booking is cancelled
 * @property {string} PENDING - Booking is awaiting confirmation
 * @property {string} COMPLETED - Booking is completed successfully
 */

export enum BOOKING_STATUS {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED"
}