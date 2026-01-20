const mysql = require("mysql2/promise");

function requiredEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === null || value === "") {
    const err = new Error(`Missing required environment variable: ${name}`);
    err.code = "MISSING_ENV";
    err.envName = name;
    throw err;
  }
  return value;
}

let pool;

function getPool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: requiredEnv("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    user: requiredEnv("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    database: requiredEnv("DB_NAME"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}

module.exports = { getPool };

