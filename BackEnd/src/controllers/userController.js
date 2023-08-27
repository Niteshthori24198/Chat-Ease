
const asyncHandler = require('express-async-handler')

const userModel = require('../models/user.model')

const searchUsers = asyncHandler(async (req, res) => {


    let temp = req.query.search ?
        {
            $or: [
                { userName: { $regex: req.query.search, $options: "i" } },

                { email: { $regex: req.query.search, $options: "i" } },
            ],
        } : {}



    const users = await userModel.find(temp)
        .find({ _id: { $ne: req.user._id } });


    res.send(users);

})

module.exports = { searchUsers }