const express = require("express");
const usersRouter = require("./routes/users");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/users", usersRouter);

// Basic error handler
app.use((err, req, res, next) => {
  if (err && err.code === "MISSING_ENV") {
    return res.status(500).json({
      error: `Server DB config missing. Create a .env file (see env.example). Missing: ${err.envName}`
    });
  }

  // MySQL duplicate key error (example)
  if (err && err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Duplicate value" });
  }

  const status = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

module.exports = { app };

