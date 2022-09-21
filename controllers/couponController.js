let adminPartials = true;
let adminPartialsDont = true;
let submenuShowProduct = true;
const Coupon = require('../models/coupon')

var cc = require('coupon-code');


module.exports = {
    viewAllCoupons: async (req, res) => {
        let coupons = await Coupon.aggregate([
            { "$project": {
              "totalCouponUsed": {
                "$size": {
                  "$filter": {
                    "input": "$couponCodes",
                    "cond": { "$eq": [ "$$this.status", false ] }
                  }
                }
                },
                maxPrice:1,
                minPrice:1,
                offerPrice:1,
                quantity: 1,
                expiryDate:1,
                startDate:1,
   
            }}
          ])
        console.log(coupons)
        res.render('admin/coupon', {
            adminPartials,
            submenuShowProduct,
            admin: req.session.admin,
            coupons
        })
    },
    addCoupon: async (req, res) => {
        try {
            // var couponCode = cc.generate() ;
            let data=req.body
            let couponCodes=[]
            for (var i = 0; i < data.quantity; i++){
               let val= {
                    couponCode: cc.generate(),
                   userId: null,
                    status:true
                }
                couponCodes.push(val)
            }
        let result= await Coupon.create({
            ...req.body,
            couponCodes,
        })
            console.log(couponCodes)
            if (result) {
            res.redirect('/admin/v1/coupon-management')
        }
        } catch (error) {
            console.log(error)
            res.redirect('/404error')
        }
        
    },
    deleteCoupon: async(req, res) => {
        let couponId = req.body.couponId
        try {
            let result = await Coupon.findByIdAndDelete(couponId)
            result ? res.status(200).json({ status: true }) : res.status(404).send(error);
        } catch (error) {
            res.status(404).send(error)
        }
        
    }
} 