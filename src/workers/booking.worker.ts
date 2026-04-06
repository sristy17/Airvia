import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { pool } from "../config/db.js";
import { CreateBookingJob } from "../services/bookings/dto/booking.dto.js";

const bookingWorker = new Worker<CreateBookingJob>(
  "bookingQueue",
  async (job: Job<CreateBookingJob>) => {
    const { flight_id, customer_id, seat_number } = job.data;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Lock seat row
      const seatRes = await client.query(
        `SELECT * FROM flight_seats
         WHERE flight_id = $1 AND seat_number = $2
         FOR UPDATE`,
        [flight_id, seat_number]
      );

      if (seatRes.rows.length === 0) {
        throw new Error("Seat not found");
      }

      if (seatRes.rows[0].is_booked) {
        throw new Error("Seat already booked");
      }

      // Update seat
      await client.query(
        `UPDATE flight_seats
         SET is_booked = true
         WHERE flight_id = $1 AND seat_number = $2`,
        [flight_id, seat_number]
      );

      // Update flight
      await client.query(
        `UPDATE flights
         SET available_seats = available_seats - 1
         WHERE flight_id = $1`,
        [flight_id]
      );

      // Insert booking
      await client.query(
        `INSERT INTO bookings
         (flight_id, customer_id, seat_number, status)
         VALUES ($1, $2, $3, 'CONFIRMED')`,
        [flight_id, customer_id, seat_number]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
  { connection: redisConnection }
);

bookingWorker.on("completed", (job) => {
  console.log(`Booking completed for job ${job.id}`);
});

bookingWorker.on("failed", (job, err) => {
  console.error(`Booking failed for job ${job?.id}`, err);
});