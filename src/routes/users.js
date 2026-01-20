const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

// Create user
router.post("/", usersController.createUser);

// List users
router.get("/", usersController.listUsers);

// Get user by id
router.get("/:id", usersController.getUserById);

// Update user
router.put("/:id", usersController.updateUser);

// Delete user
router.delete("/:id", usersController.deleteUser);

module.exports = router;

