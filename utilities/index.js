const invModel = require("../models/inventory-model")

const Util = {}

/* ************************
 * Build dynamic navigation
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += `<li><a href="/">Home</a></li>`

  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`
  })

  list += "</ul>"
  return list
}

/* ************************
 *  Currency / number helpers
 ************************** */
Util.formatUSD = function (amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

Util.formatNumber = function (num) {
  return new Intl.NumberFormat("en-US").format(num)
}

/* ************************
 *  Build classification grid
 ************************** */
Util.buildClassificationGrid = function (data) {
  if (!data || !data.rows || data.rows.length === 0) {
    return "<p>No vehicles found.</p>"
  }

  let grid = '<ul class="vehicle-grid">'
  data.rows.forEach((vehicle) => {
    grid += "<li>"
    grid += `<a href="/inv/detail/${vehicle.inv_id}">`
    grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
    grid += `<h3>${vehicle.inv_make} ${vehicle.inv_model}</h3>`
    grid += `<p>${Util.formatUSD(vehicle.inv_price)}</p>`
    grid += "</a>"
    grid += "</li>"
  })
  grid += "</ul>"
  return grid
}

/* ************************
 *  Build vehicle detail view
 ************************** */
Util.buildVehicleDetailView = function (vehicle) {
  if (!vehicle) {
    return "<p>Vehicle not found.</p>"
  }

  const price = Util.formatUSD(vehicle.inv_price)
  const miles = Util.formatNumber(vehicle.inv_miles)

  return `
  <section class="vehicle-detail">
    <div class="vehicle-detail__image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>
    <div class="vehicle-detail__info">
      <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <p class="vehicle-detail__price">${price}</p>
      <p class="vehicle-detail__miles">Mileage: ${miles} miles</p>
      <p class="vehicle-detail__color">Color: ${vehicle.inv_color}</p>
      <p class="vehicle-detail__desc">${vehicle.inv_description}</p>
    </div>
  </section>
  `
}

/* ************************
 *  Error handler wrapper
 ************************** */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = Util
