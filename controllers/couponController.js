let adminPartials = true;
let adminPartialsDont = true;
let submenuShowProduct = true;
const Coupon = require('../models/coupon')
const crypto = require("crypto");
var cc = require('coupon-code');


module.exports = {
    viewAllCoupons: async (req, res) => {
        let coupons = await Coupon.find({});
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
            var couponCode = cc.generate();
        let result= await Coupon.create({
            ...req.body,
            couponCode,
        })
            if (result) {
            res.redirect('/admin/v1/coupon-management')
        }
        } catch (error) {
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