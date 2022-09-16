const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



module.exports = {
    generateRazorPay: (orderDetails) => {
        return new Promise((resolve, reject) => {
            instance.orders.create({
                amount: orderDetails.subTotal*100,
                currency: "INR",
                receipt: "" + orderDetails._id,
                notes: {
                    key1: "value3",
                    key2: "value2"
                }
            }, (err, order) => {
                if (!err) { 
                    resolve(order);
                }
            })
        })
    }
}