import fs from "fs"
import ProductManager from "./ProductManager.js"

export default class CartManager {
    constructor() {
        this.path = "./carts.json"
        this.format = "utf-8"
        this.init()
    }

    init = async() => {
        if(!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, "\t"))
        }
    }

    generateID = async() => {
        let fileContent = await this.getCarts()
        return fileContent.length === 0 ? 1 : fileContent[fileContent.length - 1].id + 1
    }

    getCarts = async() => {
        const fileContent = await fs.promises.readFile(this.path, this.format)
        return JSON.parse(fileContent)
    }

    addCart = async() => {
        const carts = await this.getCarts()
        const generateId = await this.generateID()
        const newCart = { id: generateId, products: [] }
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))
        return newCart
    }

    addProductInCart = async(cartId, productId) => {
        const carts = await this.getCarts()
        console.log(carts)
        const cartById = carts.find(item => item.id == cartId)
        if(!cartById) return `Cart with ID=${cartId} Not Found`

        const products = await product.getProducts()
        const productById = products.find(item => item.id == productId)
        if(!productById) return `Product with ID=${productId} Not Found`

        const cartFilter = carts.filter(item => item.id != cartId)
        if(cartById.products.some(item => item.product == productId)) {
            const moreProductInCart = cartById.products.find(item => item.product == productId)
            moreProductInCart.quantity++
            const result = [cartById, ...cartFilter]
            await fs.promises.writeFile(this.path, JSON.stringify(result, null, "\t"))
        } else {
            cartById.products.push({ product: productById.id, quantity: 1 })
            const result = [cartById, ...cartFilter]
            await fs.promises.writeFile(this.path, JSON.stringify(result, null, "\t"))
        }
    }
}

const cart = new CartManager
const product = new ProductManager


