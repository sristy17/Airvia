import { Pool } from "pg";

const pool = new Pool({
  user: "admin",          
  host: "localhost",
  database: "airbnb",     
  password: "admin",      
  port: 5432,
});

export default pool;