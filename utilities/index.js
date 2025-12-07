// utilities/index.js
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")

// ===== ナビ HTML を作る =====
async function getNav() {
  const data = await invModel.getClassifications()

  // navタグは head.ejs 側で wrap するので、ここは <ul> のみ返す
  let nav = "<ul>"
  nav += '<li><a href="/">Home</a></li>'

  data.rows.forEach((row) => {
    nav += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`
  })

  nav += "</ul>"
  return nav
}

// ===== 一覧グリッド =====
function buildClassificationGrid(data) {
  let grid = '<ul class="vehicle-grid">'

  data.rows.forEach((vehicle) => {
    grid += `<li>
      <a href="/inv/detail/${vehicle.inv_id}">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </a>
      <h2>
        <a href="/inv/detail/${vehicle.inv_id}">
          ${vehicle.inv_make} ${vehicle.inv_model}
        </a>
      </h2>
      <span>$${Number(vehicle.inv_price).toLocaleString("en-US")}</span>
    </li>`
  })

  grid += "</ul>"
  return grid
}

// ===== 詳細ビュー =====
function buildVehicleDetailView(vehicle) {
  if (!vehicle) {
    return "<p>Vehicle not found.</p>"
  }

  return `
  <section class="vehicle-detail">
    <div class="vehicle-detail-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>
    <div class="vehicle-detail-info">
      <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <p class="detail-price">$${Number(vehicle.inv_price).toLocaleString("en-US")}</p>
      <p class="detail-description">${vehicle.inv_description}</p>
      <p>Mileage: ${Number(vehicle.inv_miles).toLocaleString("en-US")} miles</p>
      <p>Color: ${vehicle.inv_color}</p>
    </div>
  </section>`
}

// ===== 非同期エラーハンドラ =====
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// ===== classification <select> を作る =====
async function buildClassificationList(selectedId) {
  const data = await invModel.getClassifications()

  let select = '<select id="classification_id" name="classification_id" required>'
  select += '<option value="">Choose a Classification</option>'

  data.rows.forEach((row) => {
    const selected =
      Number(selectedId) === Number(row.classification_id) ? " selected" : ""
    select += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`
  })

  select += "</select>"
  return select
}

// ===== JWT チェック（毎リクエスト実行） =====
function checkJWTToken(req, res, next) {
  // デフォルト
  res.locals.loggedin = false
  res.locals.accountData = null

  const token = req.cookies ? req.cookies.jwt : null
  if (!token) {
    // ログインしていない → そのまま次へ
    return next()
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.loggedin = true
    res.locals.accountData = payload
  } catch (err) {
    console.log("JWT verification failed:", err.message)
    // 壊れたトークンの場合でもアプリを止めない
  }

  return next()
}

// ===== ログイン必須ページ用ミドルウェア =====
function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    // JWT が有効 → そのまま進む
    return next()
  }
  // ログインしていない → ログイン画面へ
  return res.redirect("/account/login")
}




module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetailView,
  handleErrors,
  buildClassificationList,
  checkJWTToken,
  checkLogin,
}
