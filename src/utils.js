import bcrypt from "bcrypt"
import { fileURLToPath } from "url"
import { dirname } from "path"
// import passport from "passport"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// export const JWT_PRIVATE_KEY = "secret"
// export const JWT_COOKIE_NAME = "coderCookieToken"

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const handlePolicies = policies => (req, res, next) => {
    const user = req.user || null
    if(policies.includes("admin")) {
        if(user.role !== "admin") return res.status(403).json({ error: "error", error: "Need to be an Admin" })
    }
    return next()
}

export default __dirname