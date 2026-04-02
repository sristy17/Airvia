import express from "express";
import {
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
  getCustomersController,
  getCustomerByIdController,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/customers", createCustomerController);
router.get("/customers", getCustomersController);
router.get("/customers/:id", getCustomerByIdController);
router.put("/customers/:id", updateCustomerController);
router.delete("/customers/:id", deleteCustomerController);

export default router;