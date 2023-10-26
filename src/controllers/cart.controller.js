import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

export const getProductsFromCart = async(req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).populate("products.product").lean()
        if (result === null) {
            return {
                statusCode: 404,
                response: { status: "error", error: "Not found" }
            }
        }
        return {
            statusCode: 200,
            response: { status: "success", payload: result }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: "error", error: err.message }
        }
    }
}

export const getCartController = async(req, res) => {
    try {
        const result = await cartModel.find().lean().exec()
        res.status(200).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const getCartByIdController = async(req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).populate("products.product").lean().exec()
        if(!result) return res.status(404).json({ status: "error", error: "ID not found" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const createCartController = async(req, res) => {
    try {
        const newCart = req.body
        const result = await cartModel.create(newCart)
        res.status(201).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const createProductsInCartController = async(req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid

        const findCartId = await cartModel.findById(cartId).lean().exec()
        if(!findCartId) return res.status(404).json({ status: "error", error: `Cart width ID=${id} not found` })

        const findProductId = await productModel.findById(productId).lean().exec()
        if(!findProductId) return res.status(404).json({ status: "error", error: "ID not found" })

        const productIndex = findCartId.products.findIndex(item => item.product == productId)
        if(productIndex > -1) findCartId.products[productIndex].quantity += 1
        else findCartId.products.push({ product: productId, quantity: 1 })
        
        const result = await cartModel.findByIdAndUpdate(cartId, findCartId, { returnDocument: "after" })  
        
        res.status(201).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const updateCartController = async(req, res) => {
    try{
        const id = req.params.cid
        const cartToUpdate = await cartModel.findById(id)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${id} not found`})

        const products = req.body.products

        //start: validaciones del array enviado por body
        if(!products) {
            return res.status(400).json({ status: "error", error: `Fields "products" is not optional` })
        }
        for(let i = 0; i < products.length; i++) {
            if(!products[i].hasOwnProperty("product") || !products[i].hasOwnProperty("quantity")) {
                return res.status(400).json({ status: "error", error: `Products must have a valid ID and a valid QUANTITY` })
            }
            if(typeof products[i].quantity !== "number") {
                return res.status(400).json({ status: "error", error: `Product quantity must be a number` })
            }
            const productToAdd = await productModel.findById(products[i].product)
            if (productToAdd === null) {
                return res.status(400).json({ status: "error", error: `Product with ID=${products[i].product} does not exists` })
            }
        }
        //end: validaciones del array enviado por body

        cartToUpdate.products = products
        const result = await cartModel.findByIdAndUpdate(id, cartToUpdate, { returnDocument: "after" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const updateProductsInCartController = async(req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const cartToUpdate = await cartModel.findById(cid)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${cid} not found`})

        const productToUpdate = await productModel.findById(pid)
        if(productToUpdate === null) return res.status(404).json({ status: "error", error: `Product width ID=${pid} not found`})
        
        const quantity = req.body.quantity

        //start:validaciones de quantity eviado por body
        if(!quantity) {
            return res.status(400).json({ status: "error", error: `Field "quantity" is not optional` })
        }
        if(typeof quantity !== "number") {
            return res.status(400).json({ status: "error", error: `product quantity must be a number` })
        }
        if(quantity === 0) {
            return res.status(400).json({ status: "error", error: `product quantity cannot be 0` })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex === -1) {
            return res.status(400).json({ status: "error", error: `Product with ID=${pid} not found in Cart with ID=${cid}`})
        } else {
            cartToUpdate.products[productIndex].quantity = quantity
        }
        //end: validaciones de quantity enviado por body

        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: "after" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const deleteCartController = async(req, res) => {
    try{
        const id = req.params.cid
        const cartToUpdate = await cartModel.findById(id)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${id} not found`})
        cartToUpdate.products = []
        const result = await cartModel.findByIdAndUpdate(id, cartToUpdate, { returnDocument: "after" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const deleteProductsInCartController = async(req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid

        const cartToUpdate = await cartModel.findById(cid)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${cid} not found`}) 

        const productToDelete = await productModel.findById(pid)
        if(productToDelete === null) return res.status(404).json({ status: "error", error: `Product width ID=${pid} not found`}) 

        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex < 0) return res.status(400).json({ status: "error", error: `Product with ID=${pid} not found in Cart with ID=${cid}`})
        cartFilter = cartToUpdate.products.filter(item => item.product.toString() !== pid)
        const result = await cartModel.findByIdAndUpdate(cid, cartFilter, ({ returnDocument: "after "}))

    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
}