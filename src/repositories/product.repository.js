export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAllPaginate = async(req) => await this.dao.getAllPaginate(req)
    getAll = async() => await this.dao.getAll()
    getById = async(id) => await this.dao.getById(id)
    create = async(data) => await this.dao.create(data) 
    update = async(id, data) => await this.dao.update(id, data, { returnDocument: "after" })
    delete = async(id) => await this.dao.delete(id)
}