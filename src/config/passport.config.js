import passport from "passport"
import local from "passport-local"
import { createHash, isValidPassword } from "../utils.js"
import userModel from "../models/user.model.js"
import cartModel from "../models/cart.model.js"
import gitHubStrategy from "passport-github2"

const localStrategy = local.Strategy

const initializePassport = () => {

    passport.use("register", new localStrategy({
        passReqToCallback: true, 
        usernameField: "email"
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if(user) {
                console.log("User already exists")
                return done(null, false)
            }
            const cartForNewUser = await cartModel.create({})
            const newUser = {
                first_name, 
                last_name, 
                age,
                email, 
                password: createHash(password),
                role
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done("error al obtener el user", false)
        }
    }))

    passport.use("login", new localStrategy({
        usernameField: "email"
    }, async(username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if(!user) return done(null, false)
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {

        }
    }))

    passport.use("github", new gitHubStrategy({
        clientID: "Iv1.538b1dba7f50ca11",
        clientSecret: "c2cf4e4345ed3b46519d0cc8c771cd181c453eeb",
        callbackURL: "http://localhost:8080/api/session/githubcb"
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if(user) return done(null, user)
            const cartForNewUser = await cartModel.create({})
            const newUser = await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
                password: " "
        })
        return done(null, newUser)
        } catch(err) {
            return done("Error", err.message)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport