
const { default: mongoose } = require("mongoose")

require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

mongoose.set('strictQuery', true);

const dbConnect = async () => {

    try {

        mongoose.connect(DATABASE_URL)
        console.log('connected to db')

    } catch (e) {

        process.exit()
    }
}

module.exports = dbConnect