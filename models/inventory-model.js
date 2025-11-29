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
  const sql = `
    SELECT i.*, c.classification_name
    FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1
    ORDER BY i.inv_id
  `
  const data = await db.query(sql, [classification_id])
  return data
}



// 個別車両
async function getVehicleById(inv_id) {
  const sql = "SELECT * FROM public.inventory WHERE inv_id = $1"
  const data = await db.query(sql, [inv_id])
  return data
}

// 分類追加
async function addClassification(classification_name) {
  const sql = `
    INSERT INTO public.classification (classification_name)
    VALUES ($1)
    RETURNING *
  `
  const data = await db.query(sql, [classification_name])
  return data
}

// ★ 車両追加
async function addInventory(
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
) {
  const sql = `
    INSERT INTO public.inventory
      (inv_make, inv_model, inv_description, inv_image,
       inv_thumbnail, inv_price, inv_year, inv_miles,
       inv_color, classification_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `

  const data = await db.query(sql, [
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    Number(classification_id),
  ])

  return data
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
}
