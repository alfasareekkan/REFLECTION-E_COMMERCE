const Admin = require('../models/admin')
const bcrypt = require('bcrypt')

module.exports = {
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let response={}
            let admin = await Admin.findOne({ email: adminData.email })
            if (admin) {
                let adminLoginStatus = await bcrypt.compare(adminData.password, admin.password)
                if (adminLoginStatus) {
                    response.status=true
                    resolve(response)
                } else {
                    response.status=false
                    resolve(response)
                }
            } else {
                response.status=false
                    resolve(response)
            }

         })
    },
    
}