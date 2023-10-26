// import { Product } from "../dao/product.factory.js"
import ProductDAO from "../dao/product.mongo.dao.js"
import ProductRepository from "../repositories/product.repository.js"

// export const ProductService = new ProductRepository(new Product())
export const ProductService = new ProductRepository(new ProductDAO())

