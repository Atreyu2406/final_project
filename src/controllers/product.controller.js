import productModel from "../models/product.model.js"
import { ProductService } from "../services/index.js"
// import ProductDTO from "../dto/product.dto.js"

export const getProducts = async(req, res) => {
    try {
        const limit = req.query.limit || 1
        const page = req.query.page || 1

        const filterOptions = {}
        if(req.query.stock) filterOptions.stock = req.query.stock
        if(req.query.category) filterOptions.category = req.query.category

        const paginateOptions = { limit, page }
        if (req.query.sort === "asc") paginateOptions.sort = { price: 1 }
        if (req.query.sort === "desc") paginateOptions.sort = { price: -1 }

        const result = await productModel.paginate({}, { page, limit, lean: true }, paginateOptions, filterOptions)

        let prevLink
        if(!req.query.page) {
            prevLink = `http://${req.hostname}:8080${req.originalUrl}?page=${result.prevPage}`
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
            prevLink = `http://${req.hostname}:8080${modifiedUrl}`
        }

        let nextLink
        if(!req.query.page) {
            nextLink = `http://${req.hostname}:8080${req.originalUrl}?page=${result.nextPage}`
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
            nextLink = `http://${req.hostname}:8080${modifiedUrl}`
        }

        return {
            statusCode: 200,
            response: {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPages: result.prevPage,
                nextPages: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? prevLink : null,
                nextLink: result.hasNextPage ? nextLink : null
            }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: "error", error: err.message }
        }
    }
}

export const getProductsController = async(req, res) => {
    // const result = await getProducts(req, res)
    const result = await ProductService.getAllPaginate(req)
    res.status(result.statusCode).json(result.response)
}

export const getProductByIdController = async(req, res) => {
    try {
        const id = req.params.pid
        // const result = await productModel.findById(id).lean().exec()
        const result = await ProductService.getById(id)
        if(!result) return res.status(404).json({ status: "error", error: "ID not found" })
        // const resultDTO = new ProductDTO(result)
        res.status(200).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const createProductController = async(req, res) => {
    try {
        const product = req.body
        // const result = await productModel.create(product)
        const result = await ProductService.create(product)
        // const products = await productModel.find().lean().exec()
        const products = await ProductService.getAll()
        req.io.emit("updatedProducts", products) 
        res.status(201).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const updateProductController = async(req, res) => {
    try {
        const id = req.params.pid
        const updatedProduct = req.body
        // const result = await productModel.findByIdAndUpdate(id, updatedProduct, { returnDocument: "after" })
        const result = await ProductService.update(id, updatedProduct)
        if(!result) return res.status(404).json({ status: "error", error: "ID not found" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}

export const deleteProductController = (req, res) => {
    try {
        const id = req.params.pid
        // const result = productModel.findByIdAndDelete(id)
        const result = ProductService.delete(id)
        if(!result) return res.status(404).json({ status: "error", error: "ID not found" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
}