import express from "express";
import flightRoutes from "../src/routes/flight.route.js";
import customerRoutes from "../src/routes/customer.route.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/", flightRoutes);
app.use("/", customerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});