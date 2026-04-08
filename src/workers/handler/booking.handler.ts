import { pool } from "../../config/db.js";
import { getBookingById, updateBookingStatus } from "../../repositories/booking.repository.js";
import { 
  getSeatForUpdate, 
  lockSeat, 
  confirmSeat 
} from "../../repositories/flightseat.repository.js";

export const processBooking = async (bookingId: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const booking = await getBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const seat = await getSeatForUpdate(client, booking.flight_id, booking.seat_number);
    if (!seat) throw new Error("Seat not found");

    const isLocked = seat.locked_until && new Date(seat.locked_until) > new Date();

    if (seat.is_booked || isLocked) {
      throw new Error("Seat unavailable");
    }

    await lockSeat(client, seat.id);
    await confirmSeat(client, seat.id);

    await updateBookingStatus(bookingId, "CONFIRMED");

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    await updateBookingStatus(bookingId, "FAILED");
    throw err;
  } finally {
    client.release();
  }
};