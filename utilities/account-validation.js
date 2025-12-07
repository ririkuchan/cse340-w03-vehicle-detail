// utilities/account-validation.js
const { body, validationResult } = require("express-validator")
const Util = require("../utilities")

/* ===============================
 *  Update Account Validation Rules
 * =============================== */
const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email address is required."),
  ]
}

/* ===============================
 *  Update Password Validation Rules
 * =============================== */
const updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters."),
  ]
}

/* ===============================
 *  Handle validation errors: Update Account
 * =============================== */
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await Util.getNav()

    // フォームに入力された値をそのまま戻す
    const account = {
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    }

    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      message: null,
      account,
    })
  }

  next()
}

/* ===============================
 *  Handle validation errors: Update Password
 * =============================== */
const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await Util.getNav()

    return res.render("account/update-password", {
      title: "Change Password",
      nav,
      errors: errors.array(),
      message: null,
    })
  }

  next()
}

module.exports = {
  updateAccountRules,
  updatePasswordRules,
  checkUpdateData,
  checkPasswordData,
}
