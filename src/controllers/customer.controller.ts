import { Request, Response } from "express";
import {
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
  getCustomersService,
  getCustomerByIdService,
} from "../services/customers/customer.service.js";

// CREATE
export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomerService(req.body);
    res.status(201).json(customer);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL
export const getCustomersController = async (req: Request, res: Response) => {
  try {
    const customers = await getCustomersService();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
export const getCustomerByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const customer = await getCustomerByIdService(id);
    res.json(customer);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// UPDATE
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

// DELETE
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