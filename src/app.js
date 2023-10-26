import express from "express"
import mongoose from "mongoose"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import session from "express-session"
import mongoStore from "connect-mongo"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import __dirname from "./utils.js"
import run from "./run.js"
import config from "./config/config.js"
import cors from "cors"

const PORT = config.apiserver.port

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))

//express-handlebars configuration
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

//session configuration
app.use(session({
    store: mongoStore.create({
        mongoUrl: config.mongo.uri,
        dbName: config.mongo.dbname
    }),
    secret: "victoria secret",
    resave: true,
    saveUninitialized: true
}))

//passport configuration
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//mongoose configuration
try {
    await mongoose.connect(config.mongo.uri, {
        dbName: config.mongo.dbname
    })
    
    //socket.io configuration
    const httpServer = app.listen(8080, () => console.log("Server Up..."))
    const io = new Server(httpServer)
    
    app.get("/", (req, res) => {
        res.render("index")
    })

    run(io, app)

} catch(err) {
    console.log(err.message)
}




