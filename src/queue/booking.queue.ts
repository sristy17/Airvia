import { bookingQueue } from "../config/queue.js";

export const addBookingJob = async (bookingId: number) => {
  await bookingQueue.add("process-booking", {
    bookingId,
  });
};