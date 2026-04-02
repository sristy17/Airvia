import { pool } from "../config/db.js";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../services/customers/dto/customer.dto.js";

// CREATE
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

// GET ALL
export const getCustomers = async () => {
  const result = await pool.query(`SELECT * FROM customers ORDER BY customer_id`);
  return result.rows;
};

// GET BY ID
export const getCustomerById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM customers WHERE customer_id = $1`,
    [id]
  );
  return result.rows[0];
};

// UPDATE
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

// DELETE
export const deleteCustomer = async (customerId: number) => {
  const result = await pool.query(
    `DELETE FROM customers WHERE customer_id = $1 RETURNING *`,
    [customerId]
  );

  return result.rows[0];
};