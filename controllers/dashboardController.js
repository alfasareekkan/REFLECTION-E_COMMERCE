let adminPartials = true
let adminPartialsDont = true
const User = require('../models/user')
const Order=require('../models/order')
module.exports = {

    adminHome: async (req, res, next) => {
        try {
            let userCount = await User.find().count()
            let totalOrders = await Order.aggregate([
                {
                    $project: {
                        products: 1,
                        
                    }
                },
                { $unwind: { path: "$products" } },
                { $match: {"products.orderStatus": {$exists:true }} },
                {
                    $group: {
                        _id:null,
                        count: {
                        $count:{},
                    }
                }}
                
                
            ])
            let totalRevenue = await Order.aggregate([
                {
                    $project: {
                    products:1
                    }
                },
                { $unwind: { path: "$products" } },
                { $match: { "products.paymentStatus": true } },
                {
                    $group: {
                        _id:null,
                        totalRevenue: {
                        $sum:"$products.eachTotal"
                    }
                }}
                
                
            ])
            let lastThirteenDaysOrders =await Order.aggregate([
                {
                    $project: {
                        products: 1,
                        createdAt: 1,
                        "deliveryAddress.firstName": 1,
                        "deliveryAddress.lastName": 1,
                        paymentType:1
                        

                    }
                },
                { $unwind: { path: "$products" } },
                { $match: { "products.orderStatus": { $exists: true } } },
                {
                    $match:
                       {
                          $expr:
                             {
                                $gt:
                                   [
                                      "$createdAt",
                                       {
                                          $dateSubtract:
                                             {
                                                startDate: "$$NOW",
                                                unit: "week",
                                                amount: 1
                                             }
                                       }
                                   ]
                             }
                        }
                },
                
            ])
           
            res.render('admin/adminhome', {
                adminPartials, admin: req.session.admin,
                userCount,
                totalOrders,
                totalRevenue,
                lastThirteenDaysOrders
            }) 
        } catch (error) {
            console.log(error) 
        }
        
        
    },
    pieChart: async (req, res) => {
        try {
            let piChartData = await Order.aggregate([
                {
                    $project: {
                        products: 1,
                        paymentType:1
                        
                    }
                },
                { $unwind: { path: "$products" } },
                { $match: {"products.orderStatus": {$exists:true }} },
                {
                    $group: {
                        _id:null,
                        razorPayCount: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentType", "razorPay"] }, 1, 0 ]
                            }
                        },
                        codCount: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentType", "COD"] }, 1, 0 ]
                            }
                        },
                        
                    }
                }
                
                
            ])
            res.status(200).json({piChartData:piChartData[0]})  
        } catch (error) {
            console.log(error);
        }
    }
}