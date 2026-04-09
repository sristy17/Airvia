import express from "express";
import {
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
  getCustomersController,
  getCustomerByIdController,
} from "../controllers/customer.controller.js";

/**
 * Express router for customer-related endpoints
 *
 * Routes:
 * - POST   /customers       → Create a customer
 * - GET    /customers       → Get all customers
 * - GET    /customers/:id   → Get customer by ID
 * - PUT    /customers/:id   → Update customer
 * - DELETE /customers/:id   → Delete customer
 *
 * @type {import("express").Router}
 */

const router = express.Router();

/**
 * @route POST /customers
 * @desc Create a new customer
 */

router.post("/customers", createCustomerController);

/**
 * @route GET /customers
 * @desc Fetch all customers
 */

router.get("/customers", getCustomersController);

/**
 * @route GET /customers/:id
 * @desc Fetch a customer by ID
 */

router.get("/customers/:id", getCustomerByIdController);

/**
 * @route PUT /customers/:id
 * @desc Update a customer
 */

router.put("/customers/:id", updateCustomerController);

/**
 * @route DELETE /customers/:id
 * @desc Delete a customer
 */

router.delete("/customers/:id", deleteCustomerController);

export default router;