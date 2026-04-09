import { pool } from "../config/db.js";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../services/customers/dto/customer.dto.js";

/**
 * Create a new customer
 *
 * @param {CreateCustomerDTO} data - Customer data
 * @returns {Promise<any>} Newly created customer record
 */

export const createCustomer = async (data: CreateCustomerDTO) => {
  const query = `
    INSERT INTO customers (name, contact, gender, age)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    data.name,
    data.contact,
    data.gender || null,
    data.age,
  ]);

  return result.rows[0];
};

/**
 * Fetch all customers
 *
 * @returns {Promise<any[]>} List of customers
 */

export const getCustomers = async () => {
  const result = await pool.query(`SELECT * FROM customers ORDER BY customer_id`);
  return result.rows;
};

/**
 * Fetch a customer by ID
 *
 * @param {number} id - Customer ID
 * @returns {Promise<any>} Customer record
 */

export const getCustomerById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM customers WHERE customer_id = $1`,
    [id]
  );
  return result.rows[0];
};

/**
 * Update a customer (partial update supported)
 *
 * Dynamically updates only the provided fields.
 *
 * @param {number} customerId - Customer ID
 * @param {UpdateCustomerDTO} data - Fields to update
 * @returns {Promise<any>} Updated customer record
 */

export const updateCustomer = async (
  customerId: number,
  data: UpdateCustomerDTO
) => {
  const allowedFields = ["name", "contact", "gender", "age"];

  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const key of allowedFields) {
    if ((data as any)[key] !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push((data as any)[key]);
      index++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields provided");
  }

  const query = `
    UPDATE customers
    SET ${fields.join(", ")}
    WHERE customer_id = $${index}
    RETURNING *;
  `;

  values.push(customerId);

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Delete a customer
 *
 * @param {number} customerId - Customer ID
 * @returns {Promise<any>} Deleted customer record
 */

export const deleteCustomer = async (customerId: number) => {
  const result = await pool.query(
    `DELETE FROM customers WHERE customer_id = $1 RETURNING *`,
    [customerId]
  );

  return result.rows[0];
};