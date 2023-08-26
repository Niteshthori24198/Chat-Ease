
const asyncHandler = require('express-async-handler')

const jwt = require("jsonwebtoken")

const userModel = require('../models/user.model')


const tokenCheck = asyncHandler(async ( req, res, next ) => {
   
    if(req.headers.authorization){

        try{

            
            let token = req.headers.authorization
    
            const decodedId = jwt.verify(token, "WE_CON_SECRET")
            
            req.user = await userModel.findById(decodedId.id).select('-password')
            
            return next();

        }catch(e){

            return res.status(401).send("Unauthorized , Invalid Token")
        
        }
    
    }

    
    return res.status(401).send("Token Not Found")

})

module.exports = tokenCheck