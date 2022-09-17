const userServices = require('../services/userServices')
const User = require('../models/user')
const mongoose=require('mongoose')

module.exports = {
    userProfile: (req, res) => {
        let userDetails=req.session.user
        res.render('user/userProfile/userProfile', { userDetails })
    },
    userAccountAddress:async (req, res) => {
        let userDetails = req.session.user
        let addresses = await userServices.findUser(userDetails._id);
        // console.log(addresses,addresses.length) 
        

        res.render('user/userProfile/userAddress',{userDetails,addresses:addresses.addresses})
    },
    deleteAddress: async(req, res) => {
        let userDetails = req.session.user._id
        let addressId = req.params.id
        addressId = parseInt(addressId)
        console.log(addressId)
        
        
        let result =await User.updateOne({ _id: userDetails}, { $pull: { "addresses": {"address_id" : addressId} } })
        if (result.modifiedCount == 1) {
            res.status(200).json({addressId:addressId})
        }

    }
}