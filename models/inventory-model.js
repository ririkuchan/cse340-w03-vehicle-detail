// models/inventory-model.js
const db = require("../database")

// 分類一覧
async function getClassifications() {
  const data = await db.query(
    "SELECT * FROM public.classification ORDER BY classification_id"
  )
  return data
}

// 分類ごとの車一覧
async function getInventoryByClassificationId(classification_id) {
  const data = await db.query(
    "SELECT * FROM public.inventory WHERE classification_id = $1 ORDER BY inv_id",
    [classification_id]
  )
  return data
}

// 個別車両
async function getVehicleById(inv_id) {
  const data = await db.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [inv_id]
  )
  return data
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
}
