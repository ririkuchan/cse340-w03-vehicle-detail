// routes/favoriteRoute.js
const express = require("express")
const router = express.Router()

const favoriteController = require("../controllers/favoriteController")
const Util = require("../utilities")
const favoriteValidate = require("../utilities/favorite-validation")

/* ============================
 * My Wishlist 一覧
 * GET /favorites
 * ============================ */
router.get(
  "/",
  Util.checkLogin,
  Util.handleErrors(favoriteController.buildFavorites)
)

/* ============================
 * Wishlist 追加フォーム
 * GET /favorites/add/:inv_id
 * ============================ */
router.get(
  "/add/:inv_id",
  Util.checkLogin,
  Util.handleErrors(favoriteController.buildAddFavorite)
)

/* ============================
 * Wishlist 追加処理
 * POST /favorites/add/:inv_id
 * ============================ */
router.post(
  "/add/:inv_id",
  Util.checkLogin,
  favoriteValidate.favoriteRules(),
  favoriteValidate.checkFavoriteData,
  Util.handleErrors(favoriteController.addFavorite)
)


/* ============================
 * Wishlist 削除
 * POST /favorites/delete/:favorite_id
 * ============================ */
router.post(
  "/delete/:favorite_id",
  Util.checkLogin,
  Util.handleErrors(favoriteController.deleteFavorite)
)

/* ============================
 * ✅ 動作確認ルート
 * http://localhost:5500/favorites/test
 * ============================ */
router.get("/test", (req, res) => {
  res.send("favorites router is working")
})

/* ============================
 * 最後に router を export
 * ============================ */
module.exports = router
