/**
 * Flight entity interface
 *
 * Represents a flight record stored in the database.
 */

export interface Flight {
  /** Unique flight identifier */
  flight_id: number;

  /** Airline name */
  airline: string;

  /** Flight arrival time */
  arrival_time: Date;

  /** Flight departure time */
  departure_time: Date;

  /** Total number of seats available on the flight */
  total_seats: number;

  /** Number of seats currently available for booking */
  available_seats: number;
}

/**
 * Data Transfer Object for creating a flight
 *
 * Used when adding a new flight to the system.
 */

export interface CreateFlightDTO {
  /** Airline name */
  airline: string;

  /** Arrival time of the flight */
  arrival_time: Date;

  /** Departure time of the flight */
  departure_time: Date;

  /** Total number of seats */
  total_seats: number;
}

/**
 * Data Transfer Object for updating a flight
 *
 * Supports partial updates (only provided fields will be updated).
 */

export interface UpdateFlightDTO {
  /** Updated airline name (optional) */
  airline?: string;

  /** Updated arrival time (optional) */
  arrival_time?: Date;

  /** Updated departure time (optional) */
  departure_time?: Date;

  /** Updated total seats (optional) */
  total_seats?: number;
}