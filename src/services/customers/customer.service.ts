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

/**
 * Create a new customer
 *
 * Validates input data and trims string fields before insertion.
 *
 * @param {CreateCustomerDTO} data - Customer input data
 * @returns {Promise<Customer>} Newly created customer
 */

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

/**
 * Get all customers
 *
 * @returns {Promise<Customer[]>} List of customers
 */

export const getCustomersService = async (): Promise<Customer[]> => {
  return await getCustomers();
};

/**
 * Get a customer by ID
 *
 * @param {number} id - Customer ID
 * @returns {Promise<Customer>} Customer record
 */

export const getCustomerByIdService = async (id: number): Promise<Customer> => {
  if (!id) throw new Error("Customer ID required");

  const customer = await getCustomerById(id);

  if (!customer) throw new Error("Customer not found");

  return customer;
};

/**
 * Update a customer (partial update supported)
 *
 * Trims string fields and validates input before updating.
 *
 * @param {number} customerId - Customer ID
 * @param {UpdateCustomerDTO} data - Fields to update
 * @returns {Promise<Customer>} Updated customer record
 */

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

/**
 * Delete a customer
 *
 * @param {number} customerId - Customer ID
 * @returns {Promise<Customer>} Deleted customer record
 */

export const deleteCustomerService = async (customerId: number): Promise<Customer> => {
  if (!customerId) throw new Error("Customer ID required");

  const deleted = await deleteCustomer(customerId);

  if (!deleted) throw new Error("Customer not found");

  return deleted;
};