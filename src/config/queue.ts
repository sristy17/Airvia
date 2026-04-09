import { Queue } from "bullmq";
import { connection } from "./redis.js";

/**
 * BullMQ queue instance for handling booking-related background jobs.
 *
 * This queue is used to process asynchronous tasks such as:
 * - Booking confirmation
 * - Seat locking / release
 * - Payment processing
 * - Notifications
 *
 * The queue connects to a Redis instance defined in `redis.js`.
 *
 * @type {Queue}
 *
 * @property {string} name - Name of the queue ("booking-queue")
 * @property {object} connection - Redis connection configuration
 */

export const bookingQueue = new Queue("booking-queue", {
  connection,
});