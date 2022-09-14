const mongoose = require('mongoose');
const ProductSize = new mongoose.Schema({
    categoryId: {
        type:mongoose.Schema.Types.ObjectId
    },
    size: {
         type:String
    },
    noSqlMode: {
        type: String,
        default:"1"
    }
    
},{timestamps:true},{collection:'ProductSize'}
)
module.exports=mongoose.model('ProductSize',ProductSize)