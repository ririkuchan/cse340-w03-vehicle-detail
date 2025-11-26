// server.js
const express = require("express")
const path = require("path")
require("dotenv").config()

const rootRoutes = require("./routes/root")
const invRoutes = require("./routes/inventoryRoute")
const Util = require("./utilities")

const app = express()
const PORT = process.env.PORT || 5500

// View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// 静的ファイル
app.use(express.static(path.join(__dirname, "public")))

// ルート
app.use("/", rootRoutes)
app.use("/inv", invRoutes)

// 404（存在しないURL）
app.use(async (req, res, next) => {
  let nav = ""
  try {
    nav = await Util.getNav()
  } catch (err) {
    console.error("Nav build error in 404:", err)
  }

  res.status(404).render("error/error", {
    title: "404 Not Found",
    message: "The page you requested could not be found.",
    nav,
  })
})

// エラーハンドラ（500など）
app.use(async (err, req, res, next) => {
  console.error("Server Error:", err)

  let nav = ""
  try {
    nav = await Util.getNav()
  } catch (navErr) {
    console.error("Nav build error in error handler:", navErr)
  }

  res.status(err.status || 500).render("error/error", {
    title: "Server Error",
    message: "Sorry, something went wrong.",
    nav,
  })
})

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`)
})
