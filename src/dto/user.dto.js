export default class UserDTO {
    constructor(user) {
        this.id = user.id || user._id || null
        this.name = user.name
        this.email = user.email
        this.tickets = user.tickets || []
        this.fullname = `${user.first_name} - ${user.last_name}`
    }
}