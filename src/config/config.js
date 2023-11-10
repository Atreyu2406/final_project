import dotenv from "dotenv"

dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT || 8080
    },
    persistence: process.env.PERSISTENCE || "FILE",
    mongo: {
        uri: process.env.MONGO_URI,
        dbname: process.env.MONGO_DB_NAME
    },
    mailUser: process.env.EMAIL_USER,
    mailPass: process.env.EMAIL_PASS
}