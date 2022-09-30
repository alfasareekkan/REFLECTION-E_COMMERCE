const User = require('../models/user')
const mongoose=require('mongoose')

module.exports = {
    verifyUser: async (req, res, next) => {
        try {
            if (req.session.user) {
                let UserId = req.session.user._id;
                let user = await User.findOne({ _id:UserId, status: false })
                if (user) {

                    req.session.destroy()
                    res.redirect('/')
                }
                else {
                    next()
                }
            }
            else {
               
                req.session.myUrl = req.route.path
                // console.log(req.session.myUrl)
                

                res.redirect('/login')
            }  
        } catch (error) {
            // console.log(error);
            
        }
       
    },
    
}