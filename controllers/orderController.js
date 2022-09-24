// const { userCart } = require('../services/cartServices')
const cartServices = require("../services/cartServices");
const orderServices = require("../services/orderServices");
const userServices = require("../services/userServices");
const Cart = require("../models/cart");
const Order = require("../models/order");
const razorPayInstance = require("../utils/razorPay");
const Coupons = require('../models/coupon');
const mongoose = require('mongoose');
let adminPartials = true
let adminPartialsDont = true
let submenuShow = true

module.exports = {
  checkoutPage: async (req, res) => {
    try {
      let userDetails = req.session.user;
      let userCart = await cartServices.userCart(userDetails._id);
      let cartCount = await cartServices.cartCountHelper(userDetails._id);
      let totalPrice = await cartServices.totalPriceHelper(userDetails._id);
      let addresses = await userServices.findUser(userDetails._id);
      let redeemForm;
      totalPrice[0].couponPrice===0?redeemForm=true:redeemForm=false;
  

      res.render("user/shopping/checkout", {
        userCart,
        cartCount,
        totalPrice,
        userDetails,
        addresses: addresses.addresses,
        redeemForm
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
          totalPrice: 1,
          offerPrice:1,
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
  
        let coupon = await Coupons.findOne({
          $and: [
            { minPrice: { $lt: orderDetails.orderDetails.subTotal } },
            { maxPrice: { $gt: orderDetails.orderDetails.subTotal } }
          ]
        })
        let expDate = coupon?.expiryDate
        let expiryCheck= expDate>=Date.now() ? true:false; 
        if (expiryCheck) {
          console.log(orderDetails)
           await Coupons.updateOne({ _id: coupon._id, "couponCodes.userId":null }, { $set: { "couponCodes.$.userId": orderDetails.orderDetails.user_id } })
          
        }
 
      
          res
            .status(200)
            .json({ orderId: orderDetails.orderDetails._id});

      }
  },
  redeemCoupon: async (req, res) => {
    try {
      let data = req.body
    
      let userId = req.session.user._id;
      let isUserCouponExist = await Coupons.findOne({ "couponCodes":{$elemMatch:{userId:userId,status: true,couponCode:data.couponCode}} },{offerPrice:1})
      if (isUserCouponExist) {
       let isUpdateCart= await Cart.updateOne({user_id:userId }, {
          $set: {
            couponPrice:isUserCouponExist.offerPrice
          }
        })
       let isUpdateCoupon= await Coupons.updateOne({ _id: isUserCouponExist._id, couponCodes: { $elemMatch: { userId: userId, couponCode: data.couponCode } } }, { $set: { "couponCodes.$.status": false } }, { new: true })
        if (isUpdateCart.modifiedCount === 1 && isUpdateCoupon.modifiedCount === 1) {
          res.status(201).json({ couponStatus: true })
          
        }

      }
      else {
        res.status(201).json({couponStatus:false})
      }


      
    } catch (error) {
      console.log(error)
    }
  },
  orderDetailsViewAdmin: async (req, res) => {
    try {
      let orderDetails = await Order.find({ orderStatus: 'Confirmed' });
      
    res.render('admin/orders',
      {
        adminPartials,
        submenuShow,
        orderDetails,
        admin:req.session.admin
    })
    } catch (error) {
      res.send(404)
    }
    
  },
  orderManageByAdmin: async (req, res) => {
    let orderProductDetails = await Order.findOne({ _id: req.params.id }, { products: 1 ,deliveryAddress:1})
    console.log(orderProductDetails)
    res.render('admin/orderDetails', {
      adminPartials,
        submenuShow,
      admin: req.session.admin,
      orderProductDetails:orderProductDetails
    })
  },
  adminChangeOrderStatus: async (req, res) => {
    let { orderStatus, constantId, orderId } = req.body
    // console.log(constantId)
    let isOrderStatusAlreadyExist = await Order.findOne({
      _id: mongoose.Types.ObjectId(orderId), products: {
        $elemMatch: {
          "products.productConstantId": mongoose.Types.ObjectId(constantId),
          orderStatus: {
            $elemMatch: {
          "status":orderStatus
        }
          }
        }
      }
    })
    if (isOrderStatusAlreadyExist) {
      for (let data of isOrderStatusAlreadyExist.products) {
      // console.log(data)
        for (let i = 0; i < data.orderStatus.length; i++){
          if (data.products.productConstantId == constantId && orderStatus === data.orderStatus[i].status) {
            let lastItem = data.orderStatus.slice(-1)
            if (orderStatus === lastItem[0].status) {
              // console.log("sgsdf❤️❤️")
              data.orderStatus[i].date = Date.now()
              console.log(data.orderStatus[i].date)
              break
            }
            else{

            }
          }
        }
      }
      await isOrderStatusAlreadyExist.save()

      // console.log(isOrderStatusAlreadyExist.products[0])
    } else {
      let data={status: orderStatus,date:Date.now()}
      await Order.updateOne({
        _id: mongoose.Types.ObjectId(orderId), products: {
          $elemMatch: {
            "products.productConstantId": mongoose.Types.ObjectId(constantId),
          }
        }
      }, {
        $push: {"products.$.orderStatus": data
        
      }},{new: true})
    }
    res.status(200).json({ status: true })
  },
  userViewOrders: async (req, res) => { 
    let userId=req.session.user._id
    try {
      let order = await Order.aggregate([
        {
          $match: {user_id:mongoose.Types.ObjectId(userId) }
        },
        {
          $unwind: {
            path:'$products'
          }
        }
        
      ])
      console.log(order)
      console.log(order[0].products)
    res.render('user/userProfile/myOrders', {
      userDetails: req.session.user,
      order
    })
   } catch (error) {
    console.log(error)
   }
    
  }
};
