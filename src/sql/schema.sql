CREATE TABLE flights (
    flight_id SERIAL PRIMARY KEY,
    airline VARCHAR(200) NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,

    CONSTRAINT chk_seats CHECK (available_seats <= total_seats)
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    gender CHAR(1),
    age INT NOT NULL,
    
    CONSTRAINT chk_gender
    CHECK (gender IN ('M', 'F', 'O') OR gender IS NULL)
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    flight_id INT REFERENCES flights(flight_id) ON DELETE CASCADE,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,

    seat_number VARCHAR(10),

    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    
    CONSTRAINT chk_status
    CHECK (status IN ('CONFIRMED', 'CANCELLED', 'PENDING', 'COMPLETED'))
);

CREATE INDEX idx_booking_status
ON bookings(status);

CREATE TABLE flight_seats (
    id SERIAL PRIMARY KEY,
    flight_id INT REFERENCES flights(flight_id) ON DELETE CASCADE,

    seat_number VARCHAR(10),
    class VARCHAR(50),

    is_booked BOOLEAN DEFAULT FALSE,

    locked_until TIMESTAMP,

    UNIQUE (flight_id, seat_number)
);

CREATE INDEX idx_flight_seats_available
ON flight_seats(flight_id, is_booked);