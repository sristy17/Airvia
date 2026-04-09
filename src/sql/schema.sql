/**
 * Flights table
 *
 * Stores flight-level information including schedule and seat capacity.
 */
 
CREATE TABLE flights (
    flight_id SERIAL PRIMARY KEY, -- Unique flight identifier

    airline VARCHAR(200) NOT NULL, -- Airline name

    arrival_time TIMESTAMP NOT NULL, -- Arrival timestamp
    departure_time TIMESTAMP NOT NULL, -- Departure timestamp
    
    total_seats INT NOT NULL, -- Total seats in flight
    available_seats INT NOT NULL, -- Seats currently available

    -- Ensures available seats never exceed total seats
    CONSTRAINT chk_seats CHECK (available_seats <= total_seats)
);

/**
 * Customers table
 *
 * Stores customer details.
 */

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY, -- Unique customer identifier

    name VARCHAR(200) NOT NULL, -- Customer name
    contact VARCHAR(15) NOT NULL, -- Contact info (phone/email)

    gender CHAR(1), -- Gender: M/F/O
    age INT NOT NULL, -- Customer age
    
    -- Restrict gender values
    CONSTRAINT chk_gender
    CHECK (gender IN ('M', 'F', 'O') OR gender IS NULL)
);

/**
 * Bookings table
 *
 * Stores booking transactions linking customers to flights.
 */

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY, -- Unique booking identifier

    flight_id INT REFERENCES flights(flight_id) ON DELETE CASCADE, -- Linked flight
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE, -- Linked customer

    seat_number VARCHAR(10), -- Assigned seat number

    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Booking timestamp

    status VARCHAR(20) NOT NULL, -- Booking status
    
    -- Restrict valid booking statuses
    CONSTRAINT chk_status
    CHECK (status IN ('CONFIRMED', 'CANCELLED', 'PENDING', 'COMPLETED'))
);

/**
 * Index for faster filtering by booking status
 */

CREATE INDEX idx_booking_status
ON bookings(status);

/**
 * Flight seats table
 *
 * Stores individual seat-level data for each flight.
 */

CREATE TABLE flight_seats (
    id SERIAL PRIMARY KEY, -- Unique seat identifier

    flight_id INT REFERENCES flights(flight_id) ON DELETE CASCADE, -- Associated flight

    seat_number VARCHAR(10), -- Seat label (e.g., A1)
    class VARCHAR(50), -- Seat class (e.g., ECONOMY)

    is_booked BOOLEAN DEFAULT FALSE, -- Whether seat is booked

    locked_until TIMESTAMP, -- Temporary lock expiry time

    -- Prevent duplicate seat numbers per flight
    UNIQUE (flight_id, seat_number)
);

/**
 * Index to quickly fetch available seats
 */

CREATE INDEX idx_flight_seats_available
ON flight_seats(flight_id, is_booked);