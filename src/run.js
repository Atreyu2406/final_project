import productsRouter from "./routers/product.router.js"
import cartsRouter from "./routers/cart.router.js"
import viewsRouter from "./routers/view.router.js"
import chatRouter from "./routers/chat.router.js"
import sessionRouter from "./routers/session.router.js"
import messageModel from "./models/message.model.js"
import { handlePolicies } from "./utils.js"
// import { passportCall } from "./utils.js"

const run = (io, app) => {
    app.use((req, res, next) => {
        req.io = io
        next()
    })

    app.use("/api/products", productsRouter)
    app.use("/api/carts", cartsRouter)
    app.use("/session", sessionRouter)
    app.use("/products", handlePolicies("admin"), viewsRouter)
    app.use("/chat", chatRouter)

    io.on("connection", async socket => {
        console.log("New client connected")
        socket.on("productList", data => {
            io.emit("updatedProducts", data)
        })
        socket.broadcast.emit("alert")
        const messages = await messageModel.find().lean().exec()
        socket.emit("logs", messages)
        socket.on("message", async data => {
            await messageModel.create(data)
            const messages = await messageModel.find().lean().exec()
            io.emit("logs", messages)
        })
    })
}

export default run