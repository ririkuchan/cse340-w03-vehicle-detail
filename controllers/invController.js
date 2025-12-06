// controllers/invController.js
const invModel = require("../models/inventory-model")
const Util = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// /inv/ 管理画面
async function buildManagementView(req, res, next) {
  try {
    const nav = await Util.getNav()
    const message = req.flash ? req.flash("notice") : null

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

// GET: /inv/add-classification
async function buildAddClassification(req, res, next) {
  try {
    const nav = await Util.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      message: null,
      classification_name: "",
    })
  } catch (err) {
    next(err)
  }
}

// POST: /inv/add-classification
async function registerClassification(req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result.rowCount > 0) {
      if (req.flash) {
        req.flash("notice", "Classification was successfully added.")
      }
      return res.redirect("/inv/")
    } else {
      const nav = await Util.getNav()
      return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        message: "Sorry, the classification could not be added.",
        classification_name,
      })
    }
  } catch (err) {
    next(err)
  }
}

// GET: /inv/add-inventory
async function buildAddInventory(req, res, next) {
  try {
    const nav = await Util.getNav()
    const classifications = (await invModel.getClassifications()).rows

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      message: null,
      classifications,
      classification_id: "",
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_description: "",
    })
  } catch (err) {
    next(err)
  }
}

// POST: /inv/add-inventory
// POST: /inv/add-inventory
async function registerInventory(req, res, next) {
  try {
    // 何が来ているかログ
    console.log("POST /inv/add-inventory body:", req.body);

    let {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      inv_description,
    } = req.body;

    // ★ フォームが空のときの保険（デフォルト画像）
    if (!inv_image) {
      inv_image = "/images/vehicles/no-image.png";
    }
    if (!inv_thumbnail) {
      inv_thumbnail = "/images/vehicles/no-image-tn.png";
    }

    const addResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );

    if (addResult.rowCount > 0) {
      if (req.flash) {
        req.flash("notice", "Vehicle was successfully added.");
      }
      return res.redirect("/inv/");
    } else {
      const nav = await Util.getNav();
      const classifications = (await invModel.getClassifications()).rows;
      return res.status(400).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        message: "Sorry, the vehicle could not be added.",
        errors: null,
        classifications,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        inv_miles,
        inv_color,
        inv_image,
        inv_thumbnail,
        inv_description,
      });
    }
  } catch (err) {
    console.error("registerInventory error:", err);
    next(err);
  }
}


async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const nav = await Util.getNav()
    const grid = Util.buildClassificationGrid(data)

    const classificationName =
      data.rows.length > 0 ? data.rows[0].classification_name : "Vehicles"

    res.render("inventory/classification", {
      title: `${classificationName} vehicles`,
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

async function buildDetail(req, res, next) {
  try {
    const invId = req.params.invId
    const result = await invModel.getVehicleById(invId)
    const nav = await Util.getNav()

    const vehicle = result.rows[0]
    const detailView = Util.buildVehicleDetailView(vehicle)

    const title = vehicle
      ? `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
      : "Vehicle detail"

    res.render("inventory/detail", {
      title,
      nav,
      detailView,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  buildManagementView,
  buildAddClassification,
  registerClassification,
  buildAddInventory,
  registerInventory,
  buildByClassificationId,
  buildDetail,
}
