import { GENDER } from "../../../core/enums.js";

/**
 * Customer entity interface
 *
 * Represents a customer record stored in the database.
 */

export interface Customer {
  /** Unique customer identifier */
  customer_id: number;

  /** Full name of the customer */
  name: string;

  /** Contact information (e.g., phone or email) */
  contact: string;

  /** Gender of the customer (optional) */
  gender?: GENDER;

  /** Age of the customer */
  age: number;
}

/**
 * Data Transfer Object for creating a customer
 *
 * Used when creating a new customer record.
 */

export interface CreateCustomerDTO {
  /** Full name of the customer */
  name: string;

  /** Contact information */
  contact: string;

  /** Gender (optional) */
  gender?: GENDER;

  /** Age of the customer */
  age: number;
}

/**
 * Data Transfer Object for updating a customer
 *
 * Supports partial updates (only provided fields will be updated).
 */

export interface UpdateCustomerDTO {
  /** Updated name (optional) */
  name?: string;

  /** Updated contact (optional) */
  contact?: string;

  /** Updated gender (optional) */
  gender?: GENDER;

  /** Updated age (optional) */
  age?: number;
}