import { getProductsFromCart } from "./cart.controller.js"
import { getProducts } from "./product.controller.js"
import productModel from "../models/product.model.js"

export const getViewProductsController = async(req, res) => {
    const result = await getProducts(req, res)
    if(result.statusCode === 200) {
        res.render("home", { products: result.response.payload, paginateInfo: {
            hasPrevPage: result.response.hasPrevPage,
            hasNextPage: result.response.hasNextPage,
            prevLink: result.response.prevLink,
            nextLink: result.response.nextLink,
            }
        })
    } else {
        res.status(result.statusCode).json({ status: "error", error: result.response.error})
    }
}

export const getViewRealTimeProductsController = async(req, res) => {
    try {
        const products = await productModel.find().lean().exec()
        res.render("realTimeProducts", { products })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const getViewCarts = async(req, res) => {
    const result = await getProductsFromCart(req, res)
    if(result.statusCode === 200) {
        res.render("productsFromToCart", { cart: result.response.payload })
        console.log(result.response.payload)
    } else {
        res.status(result.statusCode).json({ status: "error", error: result.response.error })
    }
    // try {
    //     const id = req.params.cid
    //     const result = await cartModel.findById(id).lean().exec()
    //     if(!result) return res.status(404).json({ status: "error", error: "Not Found" })
    //     // res.status(200).json({ status: "success", payload: result })
    //     console.log(result)
    //     res.render("carts", { cid: result._id, products: result.products } )
    // } catch(err) {
    //     res.status(500).json({ status: "error", error: err.message })
    // }
}