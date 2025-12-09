// models/favorite-model.js
const pool = require("../database")

/** Wishlist に 1 件追加 */
async function addFavorite(account_id, inv_id, favorite_notes) {
  const sql = `
    INSERT INTO public.account_favorites (
      account_id,
      inv_id,
      favorite_notes
    )
    VALUES ($1, $2, $3)
    RETURNING *
  `
  return pool.query(sql, [account_id, inv_id, favorite_notes])
}

/** ログイン中ユーザーの Wishlist 一覧を取得 */
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT
      af.favorite_id,
      af.favorite_notes,
      af.favorite_created,
      i.inv_id,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      i.inv_price
    FROM public.account_favorites AS af
      JOIN public.inventory AS i ON af.inv_id = i.inv_id
    WHERE af.account_id = $1
    ORDER BY af.favorite_created DESC
  `
  return pool.query(sql, [account_id])
}

/** 1 件削除 */
async function deleteFavorite(favorite_id, account_id) {
  const sql = `
    DELETE FROM public.account_favorites
    WHERE favorite_id = $1 AND account_id = $2
  `
  return pool.query(sql, [favorite_id, account_id])
}

module.exports = {
  addFavorite,
  getFavoritesByAccount,
  deleteFavorite,
}
