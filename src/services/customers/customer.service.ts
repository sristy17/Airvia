import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById,
} from "../../repositories/customer.repository.js";

import {
  CreateCustomerDTO,
  UpdateCustomerDTO,
  Customer,
} from "./dto/customer.dto.js";

import { trimString } from "../../core/utils/trim.js";

// CREATE
export const createCustomerService = async (
  data: CreateCustomerDTO
): Promise<Customer> => {

  const name = trimString(data.name);
  const contact = trimString(data.contact);

  if (!name || !contact || !data.age) {
    throw new Error("Name, contact and age are required");
  }

  if (data.age <= 0) {
    throw new Error("Age must be greater than 0");
  }

  return await createCustomer({
    ...data,
    name,
    contact,
  });
};

// GET ALL
export const getCustomersService = async (): Promise<Customer[]> => {
  return await getCustomers();
};

// GET BY ID
export const getCustomerByIdService = async (id: number): Promise<Customer> => {
  if (!id) throw new Error("Customer ID required");

  const customer = await getCustomerById(id);

  if (!customer) throw new Error("Customer not found");

  return customer;
};

// UPDATE
export const updateCustomerService = async (
  customerId: number,
  data: UpdateCustomerDTO
): Promise<Customer> => {

  if (!customerId) throw new Error("Customer ID required");

  if (data.name) data.name = trimString(data.name);
  if (data.contact) data.contact = trimString(data.contact);

  if (data.age !== undefined && data.age <= 0) {
    throw new Error("Invalid age");
  }

  const updated = await updateCustomer(customerId, data);

  if (!updated) throw new Error("Customer not found");

  return updated;
};

// DELETE
export const deleteCustomerService = async (customerId: number): Promise<Customer> => {
  if (!customerId) throw new Error("Customer ID required");

  const deleted = await deleteCustomer(customerId);

  if (!deleted) throw new Error("Customer not found");

  return deleted;
};