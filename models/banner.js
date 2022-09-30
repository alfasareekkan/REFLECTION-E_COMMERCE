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
    categoryOrProductId: {
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
})