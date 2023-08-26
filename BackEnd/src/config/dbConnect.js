
const { default: mongoose } = require("mongoose")

require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

const dbConnect = async () => {

    try {

        mongoose.connect(DATABASE_URL)

    } catch (e) {

        process.exit()
    }
}

module.exports = dbConnect