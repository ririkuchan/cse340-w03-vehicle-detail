// controllers/baseController.js
const Util = require("../utilities")

async function buildHome(req, res, next) {
  try {
    const nav = await Util.getNav()
    res.render("index", {
      title: "Home",
      nav,
      message: "This is the home page.",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { buildHome }
