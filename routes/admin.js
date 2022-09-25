var express = require('express');
var router = express.Router();
const adminAuth = require('../controllers/admin.auth.controller')
const dashboard = require('../controllers/dashboardController');
const category = require('../controllers/categoryManagement')
const product=require('../controllers/product')
const upload = require('../utils/multer')
const Category=require('../models/category');
const { login } = require('../controllers/auth.controller');
const { displayAllCustomers, updateUserStatus } = require('../controllers/customer')
const coupon=require('../controllers/couponController');
const orderController = require('../controllers/orderController');
let adminPartials = true
let adminPartialsDont=true

var verifyAdmin = (req, res, next) => {
  if (req.session.admin) {
    next()
  }
  else {
    res.redirect('/admin')
  }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.admin) {
    res.redirect('/admin/admin-home')

  } else {
    res.render('admin/login', {
      adminPartials,
      adminPartialsDont,
      adminLoginValue: req.session.adminLoginValue
      
    });
    req.session.adminLoginValue=false
    
   }
  

});
router.post('/login', adminAuth.adminLogin)
router.get('/admin-home', verifyAdmin, dashboard.adminHome)
router.get('/logout', adminAuth.adminLogout)

//categoryManagement
router
  .route('/parent-category/:id?/:id2?')
  .get(verifyAdmin,category.adminviewParentCategory)
  .post(verifyAdmin,upload.single('image_url'), category.adminManageParentCategory)
  .patch(verifyAdmin,category.stateManageParentCategory)

router.get('/category',  category.adminViewCategory)
router.post('/add-category',upload.single('image_url'), category.adminAddCategory)
router.get('/delete-category/:id', category.admindelete)
router.post('/category-block/:id',category.blockCategory)
router.post('/update-category/:id?/:cloud_id?',upload.single('image_url'),  category.adminupdate)

//brand management
router.get('/brands',verifyAdmin, category.adminViewBrand)
router.post('/add-brand', verifyAdmin,upload.single('brandLogo'), category.adminAddBrand)
router.get('/delete-brand/:id', verifyAdmin,category.adminDeleteBrand)
router.post('/update-brand/:id', verifyAdmin, upload.single('brandLogo'), category.adminUpdateBrand)

//customer management
router
  .route('/customers/:id?')
  .get(displayAllCustomers)
  .post(updateUserStatus)


router
  .route('/add-products-size/:id?')
  .get(product.displayAllProductsSize)
  .post(product.adminAddProductSize)
  .delete(product.adminDeleteProductsize)
  

//products management

router.get('/products',verifyAdmin, product.adminviewAllProducts)
router.get('/add-products',verifyAdmin, product.adminAddProducts)
router.get('/get_data', verifyAdmin, product.dependentCategory);
router
  .route('/v1/get-all-size-with-catogory/:id?')
  .get(product.getAllSizeWithCatogory)
  .post(product.addSizeWithQuantity)
router.get('/view-product-quantity', product.viewAllSizesWithQuantity)
router.post('/update-quantity/:id',product.updateProductQuantity)



router.post('/add-products',verifyAdmin, upload.array('image', 3), product.addminAddProductIntoDB)
router.get('/product-unlist/:id',verifyAdmin, product.adminProductUnlist)
router.get('/product-list/:id',verifyAdmin, product.adminProductList)
router.get('/delete-product/:id/:image1_id/:image2_id/:image3_id',verifyAdmin, product.adminProductDelete) 
router.get('/edit-product/:id',verifyAdmin, product.adminEditProduct)
router.post('/update-products/:id', verifyAdmin, upload.any('image'), product.adminUpdateProduct)

//coupon management
router.get('/v1/coupon-management',verifyAdmin, coupon.viewAllCoupons)
router.post('/v1/add-coupon',verifyAdmin,upload.single('couponImage'), coupon.addCoupon)
router.delete('/v1/delete-coupon',verifyAdmin, coupon.deleteCoupon)


//order management,

router.get('/v1/order-details',verifyAdmin, orderController.orderDetailsViewAdmin)
router.get('/v1/order-management/:id',verifyAdmin, orderController.orderManageByAdmin)
router.post('/v1/change-order-status',verifyAdmin,orderController.adminChangeOrderStatus)







module.exports = router;
