// controllers/favoriteController.js
const favoriteModel = require("../models/favorite-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const favoriteController = {}

/* =========================
 * My Wishlist 一覧
 * GET /favorites
 * ========================= */
favoriteController.buildFavorites = async (req, res, next) => {
  const nav = await utilities.getNav()
  const accountId = res.locals.accountData.account_id

  const result = await favoriteModel.getFavoritesByAccount(accountId)
  const favorites = result.rows

  return res.render("favorites/index", {
    title: "My Wishlist",
    nav,
    errors: null,
    message: null,
    favorites, // ← ここがビューに渡される
  })
}

/* =========================
 * Wishlist 追加フォーム
 * GET /favorites/add/:inv_id
 * ========================= */
favoriteController.buildAddFavorite = async (req, res, next) => {
  const nav = await utilities.getNav()
  const inv_id = Number(req.params.inv_id)

  const vehicleResult = await invModel.getVehicleById(inv_id)
  const vehicle = vehicleResult.rows[0]

  return res.render("favorites/add", {
    title: "Add to Wishlist",
    nav,
    errors: null,
    message: null,
    vehicle,
    favorite_notes: "",
  })
}

/* =========================
 * Wishlist 追加処理
 * POST /favorites/add/:inv_id
 * ========================= */
favoriteController.addFavorite = async (req, res, next) => {
  try {
    const accountId = res.locals.accountData.account_id
    const { inv_id, favorite_notes } = req.body

    console.log("ADD FAVORITE:", {
      account_id: accountId,
      inv_id,
      favorite_notes,
    })

    await favoriteModel.addFavorite(
      accountId,
      Number(inv_id),
      favorite_notes || null
    )

    return res.redirect("/favorites")
  } catch (err) {
    console.error("Error adding favorite:", err)
    next(err)
  }
}

/* =========================
 * Wishlist 削除
 * POST /favorites/delete/:favorite_id
 * ========================= */
favoriteController.deleteFavorite = async (req, res, next) => {
  const accountId = res.locals.accountData.account_id
  const favoriteId = Number(req.params.favorite_id)

  await favoriteModel.deleteFavorite(favoriteId, accountId)
  return res.redirect("/favorites")
}

module.exports = favoriteController
