// utilities/index.js
const invModel = require("../models/inventory-model")

/** ナビゲーションの HTML を作る */
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

/** 分類一覧ページ用のグリッド */
function buildClassificationGrid(data) {
  if (!data.rows || data.rows.length === 0) {
    return "<p>No vehicles found.</p>"
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  let grid = '<ul class="vehicle-grid">'
  data.rows.forEach((row) => {
    const price = formatter.format(row.inv_price)
    grid += `
      <li>
        <a href="/inv/detail/${row.inv_id}">
          <img src="${row.inv_thumbnail}" alt="Image of ${row.inv_make} ${row.inv_model}">
          <h2>${row.inv_make} ${row.inv_model}</h2>
        </a>
        <p class="vehicle-price">${price}</p>
      </li>
    `
  })
  grid += "</ul>"

  return grid
}

/** 詳細ページのビューHTML */
function buildVehicleDetailView(data) {
  if (!data.rows || data.rows.length === 0) {
    return "<p>Vehicle not found.</p>"
  }

  const v = data.rows[0]

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  const milesFormatter = new Intl.NumberFormat("en-US")

  const price = priceFormatter.format(v.inv_price)
  const miles = milesFormatter.format(v.inv_miles)

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail-image">
        <img src="${v.inv_image}" alt="Image of ${v.inv_make} ${v.inv_model}">
      </div>
      <div class="vehicle-detail-info">
        <h2>${v.inv_year} ${v.inv_make} ${v.inv_model}</h2>
        <p class="detail-price">${price}</p>
        <p>Mileage: ${miles}</p>
        <p class="detail-description">${v.inv_description}</p>
      </div>
    </section>
  `
}

/** ルート用のエラーハンドララッパ */
function handleErrors(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetailView,
  handleErrors,
}
