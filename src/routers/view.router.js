import { Router } from "express"
import { getViewCarts, getViewProductsController, getViewRealTimeProductsController } from "../controllers/view.controller.js"
// import ProductManager from "../dao/fsManagers/ProductManager.js"
// import cartModel from "../dao/models/cart.model.js"

const router = Router()

// const product = new ProductManager()

router.get("/", getViewProductsController)
router.get("/realtimeproducts", getViewRealTimeProductsController)
router.get("/carts/:cid", getViewCarts)

export default router