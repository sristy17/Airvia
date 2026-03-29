export interface Flight {
  flight_id: number;
  airline: string;
  arrival_time: Date;
  departure_time: Date;
  total_seats: number;
}
export interface CreateFlightDTO {
  airline: string;
  arrival_time: Date;
  departure_time: Date;
  total_seats: number;
}

export interface UpdateFlightDTO {
  flight_id: number;
  airline?: string;
  arrival_time?: Date;
  departure_time?: Date;
  total_seats?: number;
}