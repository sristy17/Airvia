import { createFlight, updateFlight } from "../../repositories/flight.repository.js";
import { CreateFlightDTO, Flight, UpdateFlightDTO } from "./dto/flight.dto.js";

export const createFlightService = async (
  data: CreateFlightDTO
): Promise<Flight> => {
  const { airline, arrival_time, departure_time, total_seats } = data;
console.log(data);
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


export const updateFlightService = async (
  flightId: number,
  data: UpdateFlightDTO
): Promise<Flight> => {

  if (!flightId) {
    throw new Error("Flight ID is required");
  }

  if (data.departure_time && data.arrival_time) {
    if (new Date(data.departure_time) >= new Date(data.arrival_time)) {
      throw new Error("Departure must be before arrival");
    }
  }

  const updatedFlight = await updateFlight(flightId, data);

  if (!updatedFlight) {
    throw new Error("Flight not found");
  }

  return updatedFlight;
};