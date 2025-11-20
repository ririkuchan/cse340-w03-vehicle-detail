// controllers/baseController.js
const Util = require("../utilities")

async function buildHome(req, res) {
  const nav = await Util.getNav()
  res.render("index", {
    title: "Home",
    nav,
  })
}

module.exports = { buildHome }
