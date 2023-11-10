import ticketModel from "../models/ticket.model.js"

export default class TicketDAO {
    get = async() => await ticketModel.find()
    getById = async(id) => await ticketModel.findById(id)
    create = async(data) => await ticketModel.create(data)
    update = async(id, data) => await ticketModel.findByIdAndUpdate({ _id: id }, data )

}