import { Request, Response } from "express";
import {
  createCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  updateCustomerService,
  deleteCustomerService,
} from "../services/customers/customer.service.js";

export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomerService(req.body);

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCustomersController = async (
  req: Request,
  res: Response
) => {
  try {
    const customers = await getAllCustomersService();

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const customer = await getCustomerByIdService(id);

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateCustomerService(id, req.body);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteCustomerService(id);

    res.status(200).json({
      success: true,
      data: deleted,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};