export default class ProductDTO {
    constructor(product) {
        this.fullproduct = `${product.title} - ${product.price}`
    }
}