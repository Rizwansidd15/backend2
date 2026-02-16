const foodPartnermodel= require('../models/foodPartner.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')


async function authFoodPartnerMiddleware(req, res, next){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            messege: "Please login First"
        })
    }

    try{
       
      const decoded =   jwt.verify(token, process.env.JWT_SECRET)
      
      const foodPartner = await foodPartnermodel.findById(decoded.id);

      req.foodPartner = foodPartner

      next()
    }catch(err){
        console.log(err)
        return res.status(401).json({
         messege: "Invalid token"
      })
    }
}

async function authUserMiddleware(req, res, next){
     
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            messege: "please login first"
        })
    }

    try{
     
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id)

        req.user = user

        next()

    }catch(err){
      return res.status(401).json({
        messege: `invalid token ${err}`
      })
    }
}

module.exports={
    authFoodPartnerMiddleware,
    authUserMiddleware

}