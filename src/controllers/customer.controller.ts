import { Request, Response } from "express";
import {
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
  getCustomersService,
  getCustomerByIdService,
} from "../services/customers/customer.service.js";

/**
 * Create a new customer
 *
 * @route POST /customers
 * @param {Request} req - Express request object (expects customer data in body)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomerService(req.body);
    res.status(201).json(customer);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get all customers
 *
 * @route GET /customers
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const getCustomersController = async (req: Request, res: Response) => {
  try {
    const customers = await getCustomersService();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a customer by ID
 *
 * @route GET /customers/:id
 * @param {Request} req - Express request object (expects customer ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const getCustomerByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const customer = await getCustomerByIdService(id);
    res.json(customer);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Update a customer
 *
 * @route PUT /customers/:id
 * @param {Request} req - Express request object (expects customer ID in params and updated data in body)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const updateCustomerController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const customer = await updateCustomerService(id, req.body);

    res.json({
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete a customer
 *
 * @route DELETE /customers/:id
 * @param {Request} req - Express request object (expects customer ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const deleteCustomerController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const customer = await deleteCustomerService(id);

    res.json({
      message: "Customer deleted successfully",
      data: customer,
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};