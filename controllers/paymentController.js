const cartServices = require('../services/cartServices')
const paymentServices = require('../services/paymentServices')
const userServices=require('../services/userServices')


module.exports = {
    checkoutPage: async (req, res) => { 
        try {
            let userDetails=req.session.user
        let userCart = await cartServices.userCart(userDetails._id)
        let cartCount = await cartServices.cartCountHelper(userDetails._id)
            let totalPrice = await cartServices.totalPriceHelper(userDetails._id)
            let addresses = await userServices.findUser(userDetails._id)
            console.log(addresses.addresses)

        res.render('user/shopping/checkout',{userCart,cartCount,totalPrice,userDetails,addresses:addresses.addresses})
        } catch (error) {
            res.redirect("/404error")
            
        }
        
    },
    addAddress: async (req, res) => {
        try {
            let addresses = req.body
            let userId = req.session.user._id
            // let address
            let result;
            if (req.params.id) {
               result = await userServices.updateUserAddress(addresses, userId,req.params.id)
                
            }else{
             result = await userServices.addUserAddress(addresses, userId)

            }
            if (result) {
                res.redirect('/v1/checkout')
            }

        } catch (error) {

            res.redirect("/404error")
        }
        
        
        
        

    }

}