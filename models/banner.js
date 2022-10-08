const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
    bannerType: {
        type: String,
            enum: [
            "primary", "secondary", "third"
        ]
    },
    image: {
        type: String,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    publishStatus: {
        type: Boolean,
        default: false
    },
    headOne: {
        type: String
    },
    headTwo: {
        type: String
    }
},{timestamps: true,collection: 'banners'})
module.exports =mongoose.model('banner',bannerSchema)