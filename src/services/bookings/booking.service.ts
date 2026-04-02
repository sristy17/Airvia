import {
  createBookingRepo,
  getBookingByIdRepo,
  getAllBookingsRepo,
  updateBookingRepo,
  deleteBookingRepo,
} from "../../repositories/booking.repository.js";
import { CreateBookingDTO, UpdateBookingDTO } from "./dto/booking.dto.js";

export const createBookingService = async (data: CreateBookingDTO) => {
  return await createBookingRepo(data);
};

export const getBookingByIdService = async (id: number) => {
  const booking = await getBookingByIdRepo(id);
  if (!booking) throw new Error("Booking not found");
  return booking;
};

export const getAllBookingsService = async () => {
  return await getAllBookingsRepo();
};

export const updateBookingService = async (
  id: number,
  data: UpdateBookingDTO
) => {
  const updated = await updateBookingRepo(id, data);
  if (!updated) throw new Error("Booking not found");
  return updated;
};

export const deleteBookingService = async (id: number) => {
  const deleted = await deleteBookingRepo(id);
  if (!deleted) throw new Error("Booking not found");
  return deleted;
};