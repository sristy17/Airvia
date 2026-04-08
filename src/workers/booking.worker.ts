import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { processBooking } from "./handler/booking.handler.js";

const worker = new Worker(
  "booking-queue",
  async (job) => {
    if (job.name === "process-booking") {
      await processBooking(job.data.bookingId);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});