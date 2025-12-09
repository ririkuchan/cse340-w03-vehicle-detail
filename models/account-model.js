// models/account-model.js
const pool = require("../database")

/** email からアカウント1件取得 */
async function getAccountByEmail(account_email) {
  const sql = "SELECT * FROM public.account WHERE account_email = $1"
  return pool.query(sql, [account_email])
}

/** id からアカウント1件取得（後で update 用に使う） */
async function getAccountById(account_id) {
  const sql = "SELECT * FROM public.account WHERE account_id = $1"
  return pool.query(sql, [account_id])
}

/** アカウント情報更新 */
async function updateAccount(firstname, lastname, email, account_id) {
  const sql = `
    UPDATE public.account
    SET
      account_firstname = $1,
      account_lastname  = $2,
      account_email     = $3
    WHERE account_id = $4
    RETURNING *
  `
  return pool.query(sql, [firstname, lastname, email, account_id])
}

/** パスワード更新 */
async function updatePassword(hashedPassword, account_id) {
  const sql = `
    UPDATE public.account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *
  `
  return pool.query(sql, [hashedPassword, account_id])
}

/** 新規アカウント登録 */
async function registerAccount(firstname, lastname, email, hashedPassword) {
  const sql = `
    INSERT INTO public.account (
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `
  const result = await pool.query(sql, [
    firstname,
    lastname,
    email,
    hashedPassword,
  ])
  return result.rows[0]
}

/** email が既に存在するかチェック */
async function checkExistingEmail(account_email) {
  const sql = "SELECT account_email FROM public.account WHERE account_email = $1"
  const result = await pool.query(sql, [account_email])
  // 1件以上あれば true
  return result.rowCount > 0
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  registerAccount,
  checkExistingEmail,
}
