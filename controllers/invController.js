// controllers/invController.js
const invModel = require("../models/inventory-model")
const Util = require("../utilities")

// 分類ごとの一覧
async function buildByClassificationId(req, res) {
  const classificationId = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classificationId)
  const nav = await Util.getNav()
  const grid = Util.buildClassificationGrid(data)

  const classificationName =
    data.rows.length > 0 ? data.rows[0].classification_name : "Vehicles"

  res.render("inventory/classification", {
    title: `${classificationName} vehicles`,
    nav,
    grid,
  })
}

// 個別詳細
async function buildDetail(req, res) {
  const invId = req.params.invId
  const vehicleData = await invModel.getVehicleById(invId)
  const nav = await Util.getNav()
  const detailView = Util.buildVehicleDetailView(vehicleData)

  let title = "Vehicle detail"
  if (vehicleData.rows && vehicleData.rows.length > 0) {
    const v = vehicleData.rows[0]
    title = `${v.inv_year} ${v.inv_make} ${v.inv_model}`
  }

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
