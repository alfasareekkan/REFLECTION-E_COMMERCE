const User=require('../models/user')
const submenuShowProduct = true
let adminPartials = true
module.exports = {
    displayAllCustomers:async (req, res, next) => {
        let users = await User.find({}, { email: 1, phone_number: 1, status: 1 })
        console.log(users);
        res.render('admin/customers',
            {
                submenuShowProduct,
                adminPartials,
                users
        })
    },
    //f
    updateUserStatus:  (req, res, next) => {
        try {
            let id = req.params.id
            console.log(id)
            User.findOneAndUpdate({ _id: id }, [{ $set: { status: { $eq: [false, "$status"] } } }]).then((data) => {
                res.status(200).json(data);
             })
            
        } catch (error) {
            
        }
       
        
    }
    
} 
