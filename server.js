// server.js
const express = require("express")
const path = require("path")
require("dotenv").config()

const rootRoutes = require("./routes/root")
const invRoutes = require("./routes/inventoryRoute")

const app = express()
const PORT = process.env.PORT || 5500

// View Engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// 静的フォルダ
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/", rootRoutes)
app.use("/inv", invRoutes)

// 404 Handler
app.use((req, res, next) => {
  const nav = "" // ※ 必要なら Util.getNav() を呼んでもOK
  res.status(404).render("error/error", {
    title: "404 Not Found",
    message: "The page you requested could not be found.",
    nav,
  })
})

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  const nav = "" // ※ 必要なら Util.getNav() を呼んでもOK
  res.status(500).render("error/error", {
    title: "Server Error",
    message: err.message,
    nav,
  })
})

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`)
})
