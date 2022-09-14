const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    phone_number: {
        type: Number,
        required: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true
    },
    addresses: {
        type: Array
    },
    wishList: {
        type:Array
    },
    creteTime: {
        type:String,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default:true
    }
    // accountCreation:Date.now()
    
}, {
    collection: 'users'
    
}
)

module.exports=mongoose.model('users', userSchema)