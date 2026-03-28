CREATE TABLE flights (
    flight_id SERIAL PRIMARY KEY,
    airline VARCHAR(200) NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    total_seats INT NOT NULL
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
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    
    CONSTRAINT chk_status
    CHECK (status IN ('CONFIRMED', 'CANCELLED', 'PENDING'))
);

CREATE INDEX idx_booking_status
ON bookings(status);

CREATE TABLE seat_layouts (
    seat_number VARCHAR(10) PRIMARY KEY,
    class VARCHAR(50) NOT NULL
);


CREATE TABLE booked_seats (
    flight_id INT REFERENCES flights(flight_id) ON DELETE CASCADE,
    seat_number VARCHAR(10) REFERENCES seat_layouts(seat_number),
    booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE,
    
    PRIMARY KEY (flight_id, seat_number)
);

CREATE INDEX idx_flight_seat
ON booked_seats(flight_id);