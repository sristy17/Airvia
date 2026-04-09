import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { processBooking } from "./handler/booking.handler.js";

/**
 * BullMQ worker for processing booking-related jobs
 *
 * This worker listens to the "booking-queue" and processes jobs asynchronously.
 *
 * Supported jobs:
 * - "process-booking" → Processes a booking (seat allocation + confirmation)
 *
 * @type {Worker}
 */

const worker = new Worker(
  "booking-queue",

  /**
   * Job processor function
   *
   * Executes logic based on job name.
   *
   * @param {import("bullmq").Job} job - BullMQ job instance
   * @returns {Promise<void>}
   */

  async (job) => {
    if (job.name === "process-booking") {
      await processBooking(job.data.bookingId);
    }
  },

  {
    connection, // Redis connection for queue processing
  }
);

/**
 * Event listener for successful job completion
 *
 * @param {import("bullmq").Job} job - Completed job
 */

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

/**
 * Event listener for failed jobs
 *
 * @param {import("bullmq").Job | undefined} job - Failed job
 * @param {Error} err - Error thrown during processing
 */

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});