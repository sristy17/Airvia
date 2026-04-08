import { BOOKING_STATUS } from "../../../core/enums.js";

export interface Booking {
  booking_id: number;
  flight_id: number;
  customer_id: number;
  seat_number: string;
  booking_date: Date;
  status: BOOKING_STATUS;
}

export interface CreateBookingDTO {
  flight_id: number;
  customer_id: number;
  seat_number: string;
  status: BOOKING_STATUS;
}

export interface UpdateBookingStatusDTO {
  status: BOOKING_STATUS;
}

export interface CreateBookingJob {
  flight_id: number;
  customer_id: number;
  seat_number: string;
}