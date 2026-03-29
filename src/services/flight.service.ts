import { createFlight } from "../repositories/flight.repository.js";
import { CreateFlightDTO, Flight } from "../types/flight.types.js";

export const createFlightService = async (
  data: CreateFlightDTO
): Promise<Flight> => {
  const { airline, arrival_time, departure_time, total_seats } = data;

  if (!airline || !arrival_time || !departure_time || !total_seats) {
    throw new Error("All fields are required");
  }

  if (new Date(departure_time) >= new Date(arrival_time)) {
    throw new Error("Departure time must be before arrival time");
  }

  if (total_seats <= 0) {
    throw new Error("Total seats must be greater than 0");
  }

  const flight = await createFlight({
    airline,
    arrival_time,
    departure_time,
    total_seats,
  });

  return flight;
};