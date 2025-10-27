const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  createUserValidator,
  updateUserSchema,
  loginUserSchema,
} = require("../validator/user.validator");
const validateRequest = require("../middlewares/validateRequest");

router.post("/register", createUserValidator, userController.createUser);

router.post(
  "/login",
  validateRequest(loginUserSchema),
  userController.login
);

module.exports = router;
