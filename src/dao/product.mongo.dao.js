import productModel from "../models/product.model.js"

export default class ProductDAO {
    getAllPaginate = async(req) => {
        try {
            const limit = req.query.limit || 10
            const page = req.query.page || 1
    
            const filterOptions = {}
            if(req.query.stock) filterOptions.stock = req.query.stock
            if(req.query.category) filterOptions.category = req.query.category
    
            const paginateOptions = { lean: true, limit, page }
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
    getAll = async() => await productModel.find()
    getById = async(id) => await productModel.findById(id)
    create = async(data) => await productModel.create(data) 
    update = async(id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: "after" })
    delete = async(id) => await productModel.findByIdAndDelete(id)
}