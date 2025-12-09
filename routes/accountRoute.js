const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const Util = require("../utilities")
const accountValidate = require("../utilities/account-validation")

// Register ★追加
router.get("/register", accountController.buildRegister)
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  accountController.registerAccount
)

// Login
router.get("/login", accountController.buildLogin)
router.post("/login", accountController.loginAccount)

// Account Management
router.get(
  "/management",
  Util.checkLogin,
  accountController.buildAccountManagement
)

// Update Account
router.get(
  "/update",
  Util.checkLogin,
  accountController.buildUpdateAccount
)

router.post(
  "/update",
  Util.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  accountController.updateAccount
)

// Update Password
router.get(
  "/update-password",
  Util.checkLogin,
  accountController.buildUpdatePassword
)

router.post(
  "/update-password",
  Util.checkLogin,
  accountValidate.updatePasswordRules(),
  accountValidate.checkPasswordData,
  accountController.updatePassword
)

// Logout
router.get("/logout", accountController.logout)

module.exports = router
