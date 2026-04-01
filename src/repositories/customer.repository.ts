import { pool } from "../config/db.js";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../services/customers/dto/customer.dto.js";

export const createCustomer = async (data: CreateCustomerDTO) => {
  const query = `
    INSERT INTO customers (name, contact, gender, age)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [data.name, data.contact, data.gender || null, data.age];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllCustomers = async () => {
  const result = await pool.query(`SELECT * FROM customers ORDER BY customer_id`);
  return result.rows;
};

export const getCustomerById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM customers WHERE customer_id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateCustomer = async (id: number, data: UpdateCustomerDTO) => {
  const query = `
    UPDATE customers
    SET name = COALESCE($1, name),
        contact = COALESCE($2, contact),
        gender = COALESCE($3, gender),
        age = COALESCE($4, age)
    WHERE customer_id = $5
    RETURNING *;
  `;

  const values = [
    data.name || null,
    data.contact || null,
    data.gender || null,
    data.age || null,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteCustomer = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM customers WHERE customer_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};