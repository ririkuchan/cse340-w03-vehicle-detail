// database/index.js
const { Pool } = require("pg")

// Render の DATABASE_URL を使う
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool
