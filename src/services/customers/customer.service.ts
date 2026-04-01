import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../../repositories/customer.repository.js";

import {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "./dto/customer.dto.js";

export const createCustomerService = async (data: CreateCustomerDTO) => {
  const { name, contact, age } = data;

  if (!name || !contact || !age) {
    throw new Error("Name, contact and age are required");
  }

  return await createCustomer(data);
};

export const getAllCustomersService = async () => {
  return await getAllCustomers();
};

export const getCustomerByIdService = async (id: number) => {
  const customer = await getCustomerById(id);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export const updateCustomerService = async (
  id: number,
  data: UpdateCustomerDTO
) => {
  const updated = await updateCustomer(id, data);

  if (!updated) {
    throw new Error("Customer not found");
  }

  return updated;
};

export const deleteCustomerService = async (id: number) => {
  const deleted = await deleteCustomer(id);

  if (!deleted) {
    throw new Error("Customer not found");
  }

  return deleted;
};