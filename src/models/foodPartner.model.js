const mongoose = require('mongoose')


const foodPartnerSchema = new mongoose.Schema({
    fullname: {
         type: String,
         required: true
    },
    businessname: {
         type: String,
         required: true
    },
    email: {
         type: String,
         required: true,
         unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    uploadProfilePicture: {
         type: String,
         required: true
    }

})

const foodPartnermodel = mongoose.model("foodpartner", foodPartnerSchema)

module.exports = foodPartnermodel