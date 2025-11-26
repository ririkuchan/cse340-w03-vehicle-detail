// database/index.js
const { Pool } = require("pg")

let pool

if (process.env.DATABASE_URL) {
  // Render 用
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
} else {
  // ローカル環境（pgAdmin と同じ設定なら .env から自動で読まれる）
  pool = new Pool()
}

module.exports = {
  query: (text, params) => pool.query(text, params),
}
