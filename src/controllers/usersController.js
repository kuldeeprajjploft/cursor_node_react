const { getPool } = require("../db");

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
}

function parseId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw badRequest("Invalid id");
  return id;
}

function normalizeString(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : "";
}

function isValidEmail(email) {
  // Simple email check; enough for demo CRUD API
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createUser(req, res, next) {
  try {
    const pool = getPool();
    const name = normalizeString(req.body?.name);
    const email = normalizeString(req.body?.email);
    const age = req.body?.age;

    if (!name) throw badRequest("name is required");
    if (!email) throw badRequest("email is required");
    if (!isValidEmail(email)) throw badRequest("email is invalid");
    if (age !== undefined && (!Number.isInteger(age) || age < 0)) {
      throw badRequest("age must be a non-negative integer");
    }

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
      [name, email, age ?? null]
    );

    const id = result.insertId;
    const [rows] = await pool.execute(
      "SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT id, name, email, age, created_at, updated_at FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const pool = getPool();
    const id = parseId(req);
    const [rows] = await pool.execute(
      "SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );
    if (!rows.length) throw notFound("User not found");
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const pool = getPool();
    const id = parseId(req);
    const name = normalizeString(req.body?.name);
    const email = normalizeString(req.body?.email);
    const age = req.body?.age;

    if (name === undefined && email === undefined && age === undefined) {
      throw badRequest("Provide at least one of: name, email, age");
    }
    if (name !== undefined && !name) throw badRequest("name cannot be empty");
    if (email !== undefined) {
      if (!email) throw badRequest("email cannot be empty");
      if (!isValidEmail(email)) throw badRequest("email is invalid");
    }
    if (age !== undefined && (!Number.isInteger(age) || age < 0)) {
      throw badRequest("age must be a non-negative integer");
    }

    const [result] = await pool.execute(
      `UPDATE users
       SET
         name = COALESCE(?, name),
         email = COALESCE(?, email),
         age = COALESCE(?, age),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name ?? null, email ?? null, age ?? null, id]
    );

    if (result.affectedRows === 0) throw notFound("User not found");

    const [rows] = await pool.execute(
      "SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const pool = getPool();
    const id = parseId(req);
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) throw notFound("User not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
};

