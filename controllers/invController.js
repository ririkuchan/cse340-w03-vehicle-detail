// controllers/invController.js
const invModel = require("../models/inventory-model")
const Util = require("../utilities")

/* ************************
 * 分類ごとの一覧ページ
 * /inv/type/:classificationId
 ************************** */
async function buildByClassificationId(req, res, next) {
  const classificationId = req.params.classificationId

  // DB から該当分類の車リストを取得
  const data = await invModel.getInventoryByClassificationId(classificationId)

  // ナビゲーション
  const nav = await Util.getNav()

  // 一覧グリッド HTML
  const grid = Util.buildClassificationGrid(data)

  // タイトル用の分類名（なければ "Vehicles"）
  const classificationName =
    data.rows && data.rows.length > 0
      ? data.rows[0].classification_name || "Vehicles"
      : "Vehicles"

  // ビューをレンダリング
  res.render("inventory/classification", {
    title: `${classificationName} vehicles`,
    nav,
    grid,
  })
}

/* ************************
 * 個別詳細ページ
 * /inv/detail/:invId
 ************************** */
async function buildDetail(req, res, next) {
  const invId = req.params.invId

  // DB から該当IDの車を取得
  const data = await invModel.getVehicleById(invId)
  const vehicle = data.rows && data.rows.length > 0 ? data.rows[0] : null

  // ナビゲーション
  const nav = await Util.getNav()

  // 車が見つからなかった場合
  if (!vehicle) {
    const detailView = "<p>Vehicle not found.</p>"
    return res.status(404).render("inventory/detail", {
      title: "Vehicle not found",
      nav,
      detailView,
    })
  }

  // 詳細ページ HTML
  const detailView = Util.buildVehicleDetailView(vehicle)

  // タイトル
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

  // ビューをレンダリング
  res.render("inventory/detail", {
    title,
    nav,
    detailView,
  })
}

module.exports = {
  buildByClassificationId,
  buildDetail,
}
