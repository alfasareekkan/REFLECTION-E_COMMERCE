// const { json } = require("express");
var express = require("express");
var router = express.Router();
// const { check, validationResult } = require("express-validator");
let userPartialDont = true;
const authentication = require("../controllers/auth.controller");
const shoping = require("../controllers/shoping.js");
const cart = require("../controllers/cartController")
const { verifyUser } = require('../middleware/authenticationMiddleware')
const wishlist = require('../controllers/wishlistController');
const order = require('../controllers/orderController');
const user = require('../controllers/user')
const coupon=require('../controllers/couponController')
// const { routes } = require("../app");




/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { userDetails: req.session.user});
});
router.get("/404error", (req, res) => {
  res.render("errPage/404error", { userPartialDont });
});

router.get("/login", (req, res) => {
  if (req.session.myUrl == undefined) {
    req.session.myUrl = req.headers.referer
   }

  if (req.session.user) {
    res.redirect('/')
  }
  




  res.render("user/user-authenticatons/login", {
    userPartialDont,
    loginEmail: req.session.loginEmail,
    loginPassword: req.session.loginPassword,
   
  });
  req.session.loginPassword = false;
  req.session.loginEmail = false;
});

router.get("/sign-up", (req, res) => {
  res.render("user/user-authenticatons/sign-up", { userPartialDont, emailExist: req.session.emailExist,samepassword: req.session.samepassword});
  req.session.emailExist = false;
  req.session.samepassword=false;
});
router.post("/sign-up", authentication.signup);
router.post("/login", authentication.login);
router.get("/otpverify", (req, res) => {
  res.render("user/user-authenticatons/otp", {
    phone_number: req.session.tempUser.phone_number,
    otpStatus: req.session.otpStatus,
    userPartialDont
  });
  req.session.otpStatus = false;
});
router.post("/otpverify1", authentication.verify);
router.get('/logout',authentication.logout);
router.get('/shoping-men/:id', shoping.shopingCategoryMen)
router.get('/shoping-women/:id', shoping.shopingCategoryWomen)

router
  .route('/v1/product-detail-refelection/:id?')
  .get(shoping.productInDetail)

router.get("/v1/get-size-of-quantity/:id?", shoping.getProductQuantityWithSize)

router.post("/v1/add-product-to-cart/:id?/:productConstants?", cart.addProductToCart)

router.get('/v1/user-cart-show', verifyUser, cart.displayCart)
router.post('/v1/increment-or-decrement-cart-item-count/:id?', cart.incrementOrDecrementCartItemCount)
router.post('/v1/delete-product-from-cart', cart.deleteProductFromCart)


// wisList

router.get('/v1/user-wishlist',verifyUser,wishlist.getUserWishList)
router.get('/v1/add-product-to-whishList/:id', verifyUser, wishlist.addToWisList)
router.post('/v1/add-to-cart-from-wishlist/:id', verifyUser, wishlist.addToCart)
router.post('/v1/delete-product-from-wishList', verifyUser, wishlist.removeFromWisList)





//checkout and order
router
  .route('/v1/checkout')
  .get(verifyUser, order.checkoutPage)

router.post('/v1/checkout-user', verifyUser, order.checkOutOrder)
router.get('/v1/user-orders-view', verifyUser, order.userViewOrders)
router.post('/v1/order-cancel-user',verifyUser, order.adminChangeOrderStatus)



router
  .route('/v1/add-user-address/:id?')  
  .post(verifyUser,order.addAddress)
  .patch(verifyUser,user.deleteAddress)


 router.get('/v1/order/invoice/:id',verifyUser,order.invoice) 

router.post('/v1/verify-payment',verifyUser,order.verifyPayment)
router.get('/v1/user-profile', verifyUser, user.userProfile)
router.get('/v1/user-account-address', verifyUser, user.userAccountAddress)

//coupon 
router.get('/v1/coupons', verifyUser, coupon.viewUsersCoupon)
router.post('/v1/redeem-coupon',verifyUser,order.redeemCoupon)



module.exports = router;
