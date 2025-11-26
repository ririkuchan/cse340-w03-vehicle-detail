// utilities/index.js
const invModel = require("../models/inventory-model")

// ナビ HTML を作る
async function getNav() {
  const data = await invModel.getClassifications()

  let nav = '<nav id="primary-nav"><ul>'
  nav += '<li><a href="/">Home</a></li>'

  data.rows.forEach((row) => {
    nav += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`
  })

  nav += "</ul></nav>"
  return nav
}

// 一覧グリッド
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

// 詳細ビュー
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

// 非同期エラーハンドラ
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetailView,
  handleErrors,
}
