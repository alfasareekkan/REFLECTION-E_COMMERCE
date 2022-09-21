// const { userCart } = require('../services/cartServices')
const cartServices = require("../services/cartServices");
const orderServices = require("../services/orderServices");
const userServices = require("../services/userServices");
const Cart = require("../models/cart");
const Order = require("../models/order");
const razorPayInstance = require("../utils/razorPay");
const Coupons=require('../models/coupon')

module.exports = {
  checkoutPage: async (req, res) => {
    try {
      let userDetails = req.session.user;
      let userCart = await cartServices.userCart(userDetails._id);
      let cartCount = await cartServices.cartCountHelper(userDetails._id);
      let totalPrice = await cartServices.totalPriceHelper(userDetails._id);
      let addresses = await userServices.findUser(userDetails._id);
  

      res.render("user/shopping/checkout", {
        userCart,
        cartCount,
        totalPrice,
        userDetails,
        addresses: addresses.addresses,
      });
    } catch (error) {
      res.redirect("/404error");
    }
  },
  addAddress: async (req, res) => {
    try {
      let addresses = req.body;
      let userId = req.session.user._id;
      let refUrl=req.headers.referer

      let result;
      if (req.params.id) {
        result = await userServices.updateUserAddress(
          addresses,
          userId,
          req.params.id
        );
      } else {
        result = await userServices.addUserAddress(addresses, userId);
      }
      if (result) {
        res.redirect(refUrl);
      }
    } catch (error) {
      res.redirect("/404error");
    }
  },
  checkOutOrder: async (req, res) => {
    try {
      
      let orderDetails = req.body,
        userId = req.session.user._id,
        userCart = await cartServices.userCart(userId),
        totalPrice = await cartServices.totalPriceHelper(userId),
        addresses = await userServices.findUserAddress(
          userId,
          orderDetails.address
        )
     let order = await orderServices.createNewOrder(
        userId,
        userCart,
        totalPrice,
        addresses
      );
      console.log(order);
      if (order) {
        if (orderDetails.payment === "COD") {
          let updateOrder = await orderServices.updateOrder(
            order._id,
            orderDetails.payment,
            "Confirmed",
            false
          );
          await Cart.findByIdAndDelete(userCart[0]._id);
          res
            .status(200)
            .json({ orderId: updateOrder._id, paymentMethod: "COD" });
        } else {
          let razorPay = await razorPayInstance.generateRazorPay(order);
          razorPay.status === "created"
            ? res
                .status(200)
                .json({
                  orderDetails: order,
                  paymentMethod: "razorPay",
                  paymentDetails: razorPay,
                })
            :res.send(401) ;
        }
      }
    } catch (error) {
      res.send(401);
    }
  },
  invoice: async (req, res) => {
    let orderId = req.params.id;
    let userDetails = req.session.user;
    try {
      if (orderId.length === 24) {
        let userOrder = await Order.findById(orderId, {
          products: 1,
          deliveryAddress: 1,
          subTotal: 1,
          paymentType: 1,
          orderStatus: 1,
          updatedAt: 1,
        });
        res.render("user/shopping/invoice", { userDetails, userOrder });
      } else {
        throw new Error();
      }
    } catch (error) {
      res.redirect("/404error");
    }
  },
  verifyPayment:async (req, res) => {
      let { paymentStatus, orderDetails } = req.body;
      
      const crypto = require("crypto");
      let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      hmac.update(orderDetails.paymentDetails.id + "|" + paymentStatus.razorpay_payment_id)
      hmac= hmac.digest('hex');
      if (hmac == paymentStatus.razorpay_signature) {
        let updateOrder = await orderServices.updateOrder(
            orderDetails.orderDetails._id,
            orderDetails.paymentMethod,
            "Confirmed",
            true
          );
          
        await Cart.findByIdAndDelete(orderDetails.orderDetails.products[0]._id);
        console.log(orderDetails.orderDetails.subTotal)
        let coupon = await Coupons.findOne({
          $and: [
            { minPrice: { $lt: orderDetails.orderDetails.subTotal } },
            { maxPrice: { $gt: orderDetails.orderDetails.subTotal } }
          ]
        })
        let expDate = coupon?.expiryDate
        let expiryCheck= expDate>=Date.now() ? true:false; 
        if (expiryCheck) {
          console.log("Expiry check", expiryCheck);
          console.log("exp date:",expDate);
        }
 
        


        
          res
            .status(200)
            .json({ orderId: orderDetails.orderDetails._id});

      }
  }
};
