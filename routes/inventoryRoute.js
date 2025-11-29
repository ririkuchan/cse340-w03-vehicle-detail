// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const Util = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// 管理画面 /inv/
router.get(
  "/",
  Util.handleErrors(invController.buildManagementView)
)

// Add Classification (GET)
router.get(
  "/add-classification",
  Util.handleErrors(invController.buildAddClassification)
)

// Add Classification (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  Util.handleErrors(invController.registerClassification)
)

// Add Inventory (GET)
router.get(
  "/add-inventory",
  Util.handleErrors(invController.buildAddInventory)
)

// Add Inventory (POST)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  Util.handleErrors(invController.registerInventory)
)

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
