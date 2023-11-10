import { Router } from "express"
import passport from "passport"
import UserDTO from "../dto/user.dto.js"

const router = Router()

//View to register users
router.get("/register", (req, res) => {
    res.render("sessions/register")
})

//View to fail register
router.get("/failRegister", (req, res) => {
    res.json({ status: "error", error: "Failed register"})
})

//API to create users in the database
router.post("/register", passport.authenticate("register", { failureRedirect: "/session/failRegister" }), async(req, res) => {
    res.redirect("/session/login")
})

//View to login
router.get("/login", (req, res) => {
    res.render("sessions/login")
})

//View to fail login
router.get("/failLogin", (req, res) => {
    res.json({ status: "error", error: "Failed login"})
})

//API to login
router.post("/login", passport.authenticate("login", { failureRedirect: "/session/failLogin" }), async(req, res) => {
    // res.redirect("/products")
    if(!req.user) {
        return res.status(400).json({ status: "error", error: "Invalid credentials" })
    }
    req.session.user = req.user
    res.redirect("/products")
})

//View login with Github
router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async(req, res) => {
})

// En tu ruta protegida, después de que el usuario se haya autenticado con éxito
router.get("/current", (req, res) => {
    if (req.isAuthenticated()) {
        const userData = {
            first_name: req.user.first_name,
            last_name: req.user.last_name
        }
        const userDTO = new UserDTO(userData)
        // const firstName = req.user.first_name
        // const lastName = req.user.last_name
        res.status(200).json({ status: "success", payload: userDTO })
        // console.log("Usuario autenticado:", user)
    } else {
        res.status(400).json({ status: "error", error: "User not login" })
    }
});

//Github callback
router.get("/githubcb", passport.authenticate("github", { failureRedirect: "/register" }), async(req, res) => {
    req.session.user = req.user
    res.redirect("/")
})

//Close session
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err) res.status(500).json({ status: "error", error: err.message })
        res.redirect("/session/login")
    })
})

export default router