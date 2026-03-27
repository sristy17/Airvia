-- flights table
CREATE TABLE flights (
    flight_id SERIAL PRIMARY KEY,
    airline VARCHAR(200) NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    seats INT NOT NULL
);

-- customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    age INT NOT NULL
);

-- bookings table
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    flight_id INT REFERENCES flights(flight_id) ON DELETE CASCADE,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    booking_date TIMESTAMP NOT NULL,
    seat_number VARCHAR(10),
    status VARCHAR(50) NOT NULL
);

-- seats table
CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    flight_id INT REFERENCES flights(flight_id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    class VARCHAR(50),
    availability BOOLEAN DEFAULT TRUE
);

-- booking_seats table
CREATE TABLE booking_seats (
    booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE,
    seat_id INT REFERENCES seats(seat_id) ON DELETE CASCADE,
    PRIMARY KEY (booking_id, seat_id)
);