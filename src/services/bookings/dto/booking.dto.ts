import { BOOKING_STATUS } from "../booking.types.js";

export interface Booking {
  booking_id: number;
  flight_id: number;
  customer_id: number;
  booking_date: Date;
  status: BOOKING_STATUS;
}

export interface CreateBookingDTO {
  flight_id: number;
  customer_id: number;
  status: BOOKING_STATUS;
}

export interface UpdateBookingDTO {
  status?: BOOKING_STATUS;
}