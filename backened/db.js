import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "my_user",       
  host: "localhost",     
  database: "Tinylink_db",   
  password: "12345",     
  port: 5432,            
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch(err => console.error("Connection error", err.stack));

export default pool;
