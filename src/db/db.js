const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.DB_URI)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((err)=>{
        console.log("mongoDB connection error:  ",err)
    })
}

module.exports = connectDB