// controllers/invController.js
const invModel = require("../models/inventory-model")
const Util = require("../utilities")

// /inv/type/:classificationId
async function buildByClassificationId(req, res, next) {
  try {
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
  } catch (err) {
    next(err)
  }
}

// /inv/detail/:invId
async function buildDetail(req, res, next) {
  try {
    const invId = req.params.invId
    const result = await invModel.getVehicleById(invId)
    const nav = await Util.getNav()

    const vehicle = result.rows[0]
    const detailView = Util.buildVehicleDetailView(vehicle)

    const title = vehicle
      ? `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
      : "Vehicle detail"

    res.render("inventory/detail", {
      title,
      nav,
      detailView,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  buildByClassificationId,
  buildDetail,
}
