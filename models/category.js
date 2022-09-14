const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    subCategory: {
        type: String,
        required: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
    },
    image_url: {
        type:String
    },
    cloudinary_id: {
        type:String
    },
    status: {
        type:Boolean,
        default:true
    },
    noSqlMode: {
        type: String,
        default:"1"
    }
    

},{ timestamps:true},
    {
    collection: 'Category'
}
)
module.exports=mongoose.model('Category',categorySchema)