import { GENDER } from "../../../core/enums.js";

export interface Customer {
  customer_id: number;
  name: string;
  contact: string;
  gender?: GENDER;
  age: number;
}

export interface CreateCustomerDTO {
  name: string;
  contact: string;
  gender?: GENDER;
  age: number;
}

export interface UpdateCustomerDTO {
  name?: string;
  contact?: string;
  gender?: GENDER;
  age?: number;
}