const mongoose = require('mongoose')
const parentCategory = new mongoose.Schema({
    parentCategory: {
        type: String,
    },
    image_url: {
        type:String
    },
    cloudinary_id: {
        type:String

    },
    status: {
        type: Boolean,
    
    },
    noSqlMode:{
        type: String,
    
    }
    
}, {
    timestamps:true
}, {
    collection:'ParentCategory'
}
)
module.exports=mongoose.model('ParentCategory', parentCategory)