// utilities/inventory-validation.js
const { body, validationResult } = require("express-validator")
const Util = require(".")

//
// 1. Classification 用
//
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await Util.getNav()

    return res.status(400).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      message: null,
      classification_name: req.body.classification_name,
    })
  }
  next()
}

//
// 2. Inventory 用
//
const inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters."),
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters."),
    body("inv_year")
      .isInt({ min: 1900, max: 9999 })
      .withMessage("Year must be a valid number."),
    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Inventory image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a number greater than 0."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters."),
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),
  ]
}

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await Util.getNav()
    const classificationList = await Util.buildClassificationList(
      req.body.classification_id
    )

    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: errors.array(),
      message: null,
      classificationList,
      ...req.body, // sticky フォーム
    })
  }
  next()
}

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
}
