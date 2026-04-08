import { Queue } from "bullmq";
import { connection } from "./redis.js";

export const bookingQueue = new Queue("booking-queue", {
  connection,
});