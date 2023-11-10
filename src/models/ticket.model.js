import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    code: String,
    purchase_datetime: Number,
    amount: Number, 
    purchaser: String
})

mongoose.set("strictQuery", false)
const ticketModel = mongoose.model("tickets", ticketSchema)

export default ticketModel