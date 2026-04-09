import express from "express";
import flightRoutes from "../src/routes/flight.route.js";
import customerRoutes from "../src/routes/customer.route.js";
import bookingRoutes from "../src/routes/booking.routes.js";

/**
 * Express application instance
 *
 * Initializes middleware and registers all route handlers.
 */

const app = express();

/**
 * Server port configuration
 * @type {number}
 */

const PORT = 3000;

/**
 * Middleware to parse incoming JSON requests
 */

app.use(express.json());

/**
 * Health check route
 *
 * @route GET /
 * @returns {string} Server status message
 */

app.get("/", (req, res) => {
  res.send("Server is running");
});

/**
 * Register application routes
 *
 * - Flight routes
 * - Customer routes
 * - Booking routes
 */

app.use("/", flightRoutes);
app.use("/", customerRoutes);
app.use("/", bookingRoutes);

/**
 * Start the server
 *
 * Listens on the specified port and logs startup message.
 */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});