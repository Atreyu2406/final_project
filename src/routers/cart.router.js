import { Router } from "express"
import { getCartController, getCartByIdController, createCartController, createProductsInCartController, updateCartController, updateProductsInCartController, deleteCartController, deleteProductsInCartController } from "../controllers/cart.controller.js"
// import CartManager from "../dao/fsManagers/CartManager.js"

const router = Router()

// const cart = new CartManager()
// const fileContent = await cart.getCarts()

router.get("/", getCartController)
router.get("/:cid", getCartByIdController)
router.post("/", createCartController)
router.post("/:cid/product/:pid", createProductsInCartController)
router.put("/:cid", updateCartController)
router.put("/:cid/product/:pid", updateProductsInCartController)
router.delete("/:cid", deleteCartController)
router.delete("/:cid/product/:pid", deleteProductsInCartController)


/*
//File System

router.get("/", (req, res) => {
    const result = fileContent
    return res.json({ status: "successful", payload: result })
})

router.get("/:cid", async(req, res) => {
    const id = req.params.cid
    const result = fileContent.find(item => item.id == id)
    return res.json({ status: "successful", payload: result })
})

router.post("/", async(req, res) => {
    const result = await cart.addCart()
    return res.json({ status: "successful", payload: result })
})

router.post("/:cid/product/:pid", async(req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    let cartId = req.params.cid
    let productId = req.params.pid
    let result = await cart.addProductInCart(cartId, productId)
    if(typeof result == "string") return res.status(400).json({ status: "Error", error: result })
    res.status(200).json({ status: "Successful", payload: result })
})
*/

export default router