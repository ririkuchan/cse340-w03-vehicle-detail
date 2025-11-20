// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// /inv/type/:classificationId
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// /inv/detail/:invId
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildDetail)
)

module.exports = router
