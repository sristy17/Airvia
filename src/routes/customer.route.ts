import express from "express";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/customers", createCustomerController);
router.get("/customers", getAllCustomersController);
router.get("/customers/:id", getCustomerByIdController);
router.put("/customers/:id", updateCustomerController);
router.delete("/customers/:id", deleteCustomerController);

export default router;