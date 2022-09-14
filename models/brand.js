const mongoose = require('mongoose')
let brandShema = mongoose.Schema({
    brandName: {
        type: String,
    },
    brandLogo: {
        type: String
    },
    cloudinary_id: {
        type:String
    }
},
    { collection: 'brands' }
    ,
    { timestamps:true}
)

module.exports=mongoose.model('brands',brandShema)