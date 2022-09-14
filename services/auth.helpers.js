const User = require("../models/user");

module.exports = {
    finderUser: (userdata) => {
        let responce={}
        return new Promise(async (resolve, reject) => {
            
            let user = await User.findOne({ $or: [{ email:userdata.email},{phone_number:userdata.phone_number}] })
            if (user) {
                responce.status = true
                resolve(responce)
            }
            else {
                resolve(responce)
             }

        })
    }
}