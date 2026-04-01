export interface Customer {
  customer_id: number;
  name: string;
  contact: string;
  gender?: "M" | "F" | "O";
  age: number;
}


export interface CreateCustomerDTO {
  name: string;
  contact: string;
  gender?: "M" | "F" | "O";
  age: number;
}

export interface UpdateCustomerDTO {
  name?: string;
  contact?: string;
  gender?: "M" | "F" | "O";
  age?: number;
}

