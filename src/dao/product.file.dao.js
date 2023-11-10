import ProductManager from "../fsManagers/ProductManager.js"

const productManager = new ProductManager()

export default class ProductFileDAO {
    getAllPaginate = async(req) => {
        const result = await productManager.getProducts()
        const limit = req.query.limit
        if(typeof result == "string") {
            const error = result.split(" ")
            return {
                statusCode: parseInt(error[0].slice(1, 4)),
                response: { error: result.slice(6) }
            }
        }
        return {
            statusCode: 200,
            response: { payload: result.slice(0, limit) }
        }
    }
    getAll = async() => await productManager.getProducts()
    getById = async(id) => await productManager.getProductById(+id)
    create = async(data) => await productManager.addProduct(data)
    update = async(id, data) => await productManager.updatedProduct(+id, data)
    delete = async(id) => await productManager.deletedProduct(+id)
}