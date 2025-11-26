// routes/root.js
const express = require("express")
const router = new express.Router()
const baseController = require("../controllers/baseController")
const Util = require("../utilities")

// ホーム
router.get("/", Util.handleErrors(baseController.buildHome))

// フッターの「Error Test」リンク用
router.get("/error", (req, res, next) => {
  const err = new Error("Test error triggered from footer link.")
  err.status = 500
  next(err)
})

module.exports = router
