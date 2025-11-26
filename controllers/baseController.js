// controllers/baseController.js
const Util = require("../utilities")

async function buildHome(req, res) {
  const nav = await Util.getNav()

  res.render("index", {
    title: "Home",
    nav,
    message: "This is the home page.",
  })
}

module.exports = { buildHome }
