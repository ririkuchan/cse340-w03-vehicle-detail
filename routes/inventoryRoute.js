// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const Util = require("../utilities")

// /inv/type/:classificationId
router.get(
  "/type/:classificationId",
  Util.handleErrors(invController.buildByClassificationId)
)

// /inv/detail/:invId
router.get(
  "/detail/:invId",
  Util.handleErrors(invController.buildDetail)
)

module.exports = router
