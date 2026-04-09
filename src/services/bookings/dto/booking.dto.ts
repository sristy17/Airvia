import { BOOKING_STATUS } from "../../../core/enums.js";

/**
 * Booking entity interface
 *
 * Represents a booking record stored in the database.
 */

export interface Booking {
  /** Unique booking identifier */
  booking_id: number;

  /** Associated flight ID */
  flight_id: number;

  /** Customer ID who made the booking */
  customer_id: number;

  /** Seat number assigned to the booking (e.g., A1) */
  seat_number: string;

  /** Date when the booking was created */
  booking_date: Date;

  /** Current booking status */
  status: BOOKING_STATUS;
}

/**
 * Data Transfer Object for creating a booking
 *
 * Used when a user initiates a booking request.
 */

export interface CreateBookingDTO {
  /** Flight ID */
  flight_id: number;

  /** Customer ID */
  customer_id: number;

  /** Desired seat number */
  seat_number: string;

  /** Initial status (typically PENDING) */
  status: BOOKING_STATUS;
}

/**
 * Data Transfer Object for updating booking status
 *
 * Used for approving, rejecting, or cancelling bookings.
 */

export interface UpdateBookingStatusDTO {
  /** Updated booking status */
  status: BOOKING_STATUS;
}

/**
 * Job payload for booking queue processing
 *
 * Used by BullMQ workers to process bookings asynchronously.
 */

export interface CreateBookingJob {
  /** Flight ID */
  flight_id: number;

  /** Customer ID */
  customer_id: number;

  /** Seat number */
  seat_number: string;
}