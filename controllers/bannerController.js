let adminPartials = true;
let adminPartialsDont = true;
let submenuShowProduct = true;
let Product = require('../models/product')
let cloudinary = require('../utils/cloudinary')
let Banner = require('../models/banner')
const cartServices = require('../services/cartServices')

module.exports = {
    viewHomePage: async (req, res) => {
        let userDetails=req.session.user
        let banners = await Banner.find()
        // console.log(req.cartCount,'😒😒😒')
        let cartCount
        if (userDetails) {
            cartCount = await cartServices.cartCountHelper(userDetails._id)
        } else {
            cartCount=0
        }

        res.render("index", { userDetails: req.session.user,banners,cartCount});
    },
    // adminAddPrimary
    bannerManageByAdmin: async(req, res) => {
        let products = await Product.find({ active: true }, { title: 1 })
        let banners = await Banner.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as:'product'
                }
            },
            {
                $unwind: {
                    path:'$product'
                }
            },
            {
                $project: {
                    bannerType: 1,
                    image: 1,
                    'product.title':1,
                    publishStatus: 1,
                    headOne:1,headTwo:1,
                    
                }
            }
        ]);
        console.log(banners)
        res.render('admin/bannerManagement', {
            admin: req.session.admin,
            adminPartials,
            submenuShowProduct,
            products,
            banners
        })
    },
    addBanner: async(req, res) => {
        let data = req.body;
        try {
            let image = await cloudinary.uploader.upload(req.file.path)
            let result = await Banner.create({
                ...data,
                image: image.secure_url
            })
            if (result) res.redirect('/admin/banner-management')
            
            
        } catch (error) {
            console.error(error);
        }
    }
}