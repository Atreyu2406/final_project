import ProductRepository from "../repositories/product.repository.js"
import { Product } from "../dao/product.factory.js"

// export const ProductService = new ProductRepository(new Product())
export const ProductService = new ProductRepository(new Product())

