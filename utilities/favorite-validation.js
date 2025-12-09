// utilities/favorite-validation.js
const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const favoriteValidate = {}

/* ============================
 * Validation rules
 * ============================ */
favoriteValidate.favoriteRules = () => {
  return [
    body("favorite_notes")
      .trim()
      .isLength({ max: 500 })
      .withMessage("Notes must be 500 characters or less."),
  ]
}

/* ============================
 * エラー時のレンダー
 * ============================ */
favoriteValidate.checkFavoriteData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const inv_id = Number(req.params.inv_id)

    const vehicleResult = await require("../models/inventory-model").getVehicleById(inv_id)
    const vehicle = vehicleResult.rows[0]

    return res.render("favorites/add", {
      title: "Add to Wishlist",
      nav,
      errors: errors.array(),
      message: null,
      vehicle,
      favorite_notes: req.body.favorite_notes,
    })
  }

  next()
}

module.exports = favoriteValidate
