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
const payment = require('../controllers/paymentController');
// const { routes } = require("../app");




/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('user/user-authenticatons/forgot-password');
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
  // const url = req.headers.referer
  // console.log(url)




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
// router.post("/editQuestion", function (req, res) {
//   try {
//     console.log(req.body); 
//   } catch (err) {
//     console.log(err);
//   } finally {
//     res.end();
//   }
// });

router.get('/v1/user-cart-show', verifyUser, cart.displayCart)
router.post('/v1/increment-or-decrement-cart-item-count/:id?', cart.incrementOrDecrementCartItemCount)
router.post('/v1/delete-product-from-cart', cart.deleteProductFromCart)


// wisList

router.get('/v1/user-wishlist',verifyUser,wishlist.getUserWishList)
router.get('/v1/add-product-to-whishList/:id', verifyUser, wishlist.addToWisList)
router.post('/v1/add-to-cart-from-wishlist/:id', verifyUser, wishlist.addToCart)
router.post('/v1/delete-product-from-wishList', verifyUser, wishlist.removeFromWisList)

// router.get('*', function(req, res) {
//   res.redirect(req.session.myUrl);
// });



//checkout and payment
router
  .route('/v1/checkout')
  .get(verifyUser, payment.checkoutPage)

router.post('/v1/checkout-user',(req, res) => {
    console.log(req.body)
    // res.status(200).json({a:true})
    })



router
  .route('/v1/add-user-address/:id?')  
  .post(payment.addAddress)




  

module.exports = router;
