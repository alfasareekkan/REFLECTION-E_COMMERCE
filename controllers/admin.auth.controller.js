const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const adminHelpers=require('../services/adminHelpers')

exports.adminLogin =(req, res) => {
    adminHelpers.adminLogin(req.body).then((response) => { 
        if (response.status) {
            req.session.admin=req.body
            res.redirect('/admin/admin-home')
        } else {
            req.session.adminLoginValue = true
            res.redirect('/admin')
        }
    })
}
exports.adminLogout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/admin')
 }