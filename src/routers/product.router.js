import { Router } from "express"
import { getProductsController, getProductByIdController, createProductController, updateProductController, deleteProductController } from "../controllers/product.controller.js"
// import ProductManager from "../dao/fsManagers/ProductManager.js"

const router = Router()

// const product = new ProductManager()
// const fileContent = await product.getProducts()

router.get("/", getProductsController)
router.get("/:pid", getProductByIdController)
router.post("/", createProductController)
router.put("/:pid", updateProductController)
router.delete("/:pid", deleteProductController)


/*
//File System

router.get("/", async(req, res) => {
    const limit = req.query.limit
    if(!limit) return res.json ({ status: "successful", payload: fileContent })
    const result = fileContent.slice(0, limit)
    if(limit > fileContent.length || limit == 0) return res.json({ message: "The limit does not exist" })
    return res.json({ status: "successful", payload: result })
})

router.get("/:pid", async(req, res) => {
    const id = req.params.pid
    const result = await product.getProductById(id)
    if(typeof result === "string") return res.json({ status: "Error", message: result })
    return res.json({ status: "successful", payload: result })
})

router.post("/", async(req, res) => {
    const newProduct = req.body
    const result = await product.addProduct(newProduct)
    if(typeof result === "string") return res.json({ status: "Error", message: result })
    const products = await product.getProducts()
    req.app.get("socketio").emit("updatedProducts", products)
    return res.json({ status: "successful", payload: result })
})

router.put("/:pid", async(req, res) => {
    const id = req.params.pid
    const updatedFields = req.body
    const result = await product.updatedProduct({ id, ...updatedFields })
    if(typeof result === "string") return res.json({ status: "Error", message: result })
    return res.json({ status: "successful", message: "updated product", payload: result })
})

router.delete("/:pid", async(req, res) => {
    const id = parseInt(req.params.pid)
    const result = await product.deletedProduct(id)
    if(typeof result === "string") return res.json({ status: "Error", message: result })
    const products = await product.getProducts()
    req.app.get("socketio").emit("updatedProducts", products)
    return res.json({ status: "successful", message: "deleted product", payload: result })
})
*/

export default router