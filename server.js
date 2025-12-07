// server.js
const express = require("express")
const path = require("path")
require("dotenv").config()
const cookieParser = require("cookie-parser")

const rootRoutes = require("./routes/root")
const invRoutes = require("./routes/inventoryRoute")
const accountRoutes = require("./routes/accountRoute")
const Util = require("./utilities")

const app = express()
const PORT = process.env.PORT || 5500

// ===== View engine 設定 =====
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// ===== ミドルウェア =====
// POST データ
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie（JWT 用）
app.use(cookieParser())

// 静的ファイル
app.use(express.static(path.join(__dirname, "public")))

// 毎リクエスト JWT をチェックして res.locals に loggedin / accountData をセット
app.use(Util.checkJWTToken)

// ===== ルート登録 =====
app.use("/", rootRoutes)
app.use("/inv", invRoutes)
app.use("/account", accountRoutes)

// ===== 404（存在しないURL） =====
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

// ===== 共通エラーハンドラ（500など） =====
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

// ===== サーバー起動 =====
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`)
})
