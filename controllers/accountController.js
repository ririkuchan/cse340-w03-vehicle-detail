// controllers/accountController.js
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const accountModel = require("../models/account-model")
const Util = require("../utilities")

const accountController = {}

/* =======================
 * GET /account/login
 * ======================= */
accountController.buildLogin = async (req, res, next) => {
  try {
    const nav = await Util.getNav()

    res.render("account/login", {
      title: "Login",
      message: null,
      errors: null,
      nav,
    })
  } catch (err) {
    next(err)
  }
}

/* =======================
 * POST /account/login
 * ======================= */
accountController.loginAccount = async (req, res, next) => {
  try {
    const { account_email, account_password } = req.body
    const nav = await Util.getNav()

    // DB からユーザー取得
    const result = await accountModel.getAccountByEmail(account_email)

    if (result.rowCount < 1) {
      return res.status(400).render("account/login", {
        title: "Login",
        message: "Invalid email or password.",
        errors: null,
        nav,
      })
    }

    const account = result.rows[0]

    // パスワードチェック
    const match = await bcrypt.compare(
      account_password,
      account.account_password
    )

    if (!match) {
      return res.status(400).render("account/login", {
        title: "Login",
        message: "Invalid email or password.",
        errors: null,
        nav,
      })
    }

    // JWT に載せる情報
    const payload = {
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type: account.account_type,
    }

    // トークン作成
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    })

    // Cookie に保存
    res.cookie("jwt", token, { httpOnly: true, secure: false })

    // アカウント管理画面へ
    return res.redirect("/account/management")
  } catch (err) {
    next(err)
  }
}

/* =======================
 * GET /account/management
 * ======================= */
accountController.buildAccountManagement = async (req, res, next) => {
  try {
    const nav = await Util.getNav()

    res.render("account/account-management", {
      title: "Account Management",
      message: null,
      nav,
    })
  } catch (err) {
    next(err)
  }
}

/* =======================
 * GET /account/update
 * ======================= */
accountController.buildUpdateAccount = async (req, res, next) => {
  try {
    const nav = await Util.getNav()
    const accountData = res.locals.accountData // JWT からの情報

    res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      message: null,
      account: accountData,
    })
  } catch (err) {
    next(err)
  }
}

/* =======================
 * POST /account/update
 * ======================= */
accountController.updateAccount = async (req, res, next) => {
  try {
    const nav = await Util.getNav()
    const account_id = res.locals.accountData.account_id
    const { account_firstname, account_lastname, account_email } = req.body

    const result = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (result.rowCount === 1) {
      const updated = result.rows[0]

      // 新しい情報で JWT を作り直す
      const payload = {
        account_id: updated.account_id,
        account_firstname: updated.account_firstname,
        account_lastname: updated.account_lastname,
        account_email: updated.account_email,
        account_type: updated.account_type,
      }

      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      })
      res.cookie("jwt", token, { httpOnly: true, secure: false })

      return res.redirect("/account/management")
    } else {
      return res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        errors: null,
        message: "Update failed.",
        account: {
          account_firstname,
          account_lastname,
          account_email,
        },
      })
    }
  } catch (err) {
    next(err)
  }
}

/* =======================
 * GET /account/update-password
 * ======================= */
accountController.buildUpdatePassword = async (req, res, next) => {
  try {
    const nav = await Util.getNav()

    res.render("account/update-password", {
      title: "Change Password",
      nav,
      errors: null,
      message: null,
    })
  } catch (err) {
    next(err)
  }
}

/* =======================
 * POST /account/update-password
 * ======================= */
accountController.updatePassword = async (req, res, next) => {
  try {
    const nav = await Util.getNav()
    const account_id = res.locals.accountData.account_id
    const { account_password } = req.body

    // 新しいパスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const result = await accountModel.updatePassword(
      hashedPassword,
      account_id
    )

    if (result.rowCount === 1) {
      const message = "Password updated successfully."
      return res.render("account/account-management", {
        title: "Account Management",
        nav,
        message,
      })
    } else {
      return res.status(500).render("account/update-password", {
        title: "Change Password",
        nav,
        errors: null,
        message: "Password update failed.",
      })
    }
  } catch (err) {
    next(err)
  }
}

/* =======================
 * GET /account/logout
 * ======================= */
accountController.logout = (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = accountController
