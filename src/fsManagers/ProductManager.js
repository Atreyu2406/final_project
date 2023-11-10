import fs from "fs"

export default class ProductManager {
    constructor() {
        this.path = "./products.json"
        this.format = "utf-8"
        this.init()
    }

    init = async() => {
        if(!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, "\t"))
        }
    }

    generateID = async() => {
        let fileContent = await this.getProducts()
        return fileContent.length === 0 ? 1 : fileContent[fileContent.length - 1].id + 1
    }

    getProducts = async() => {
        const fileContent = await fs.promises.readFile(this.path, this.format)
        return JSON.parse(fileContent)
    }

    addProduct = async(product) => {
        const products = await this.getProducts()
        if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) return "[ERR] Fields are missing"
        const foundCode = products.find(item => item.code === product.code)
        if(foundCode) return "[ERR] The code exists"
        const generateId = await this.generateID()
        const newProduct = { id: generateId, status: true, thumbnail: [], ...product }
        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
        return newProduct
    }

    getProductById = async(id) => {
        const products = await this.getProducts()
        const result = products.find(item => item.id == id)
        if(!result) return "Product Not Found"
        return result
    }

    deletedProduct = async(id) => {
        const products = await this.getProducts()
        const result = products.filter(item => item.id != id)
        if(result.length === products.length) return "Product Not Found"
        const deletedProduct = products.find(item => item.id == id)
        await fs.promises.writeFile(this.path, JSON.stringify(result, null, "\t"))
        return deletedProduct
    }

    updatedProduct = async({ id, ...updatedFields }) => {
        const products = await this.getProducts()
        const index = products.findIndex(item => item.id == id)
        if (index === -1) return "Product Not Found"
        const updatedProduct = {
            ...products[index],
            ...updatedFields,
        }
        products[index] = updatedProduct
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
        return products[index]
        // Actualiza el producto encontrado utilizando el operador de propagación
        // Object.assign(updatedProduct, updatedFields);
    } 
}

const product = new ProductManager()

// product.addProduct("Harry Potter 3", "Fantastic literature", "AAA003", 15000, 12, "Books")

// product.updatedProduct({ category: "CDs" })

