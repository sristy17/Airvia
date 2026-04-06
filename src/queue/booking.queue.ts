import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { CreateBookingJob } from "../services/bookings/dto/booking.dto.js";

export const bookingQueue = new Queue<CreateBookingJob>("bookingQueue", {
  connection: redisConnection,
});