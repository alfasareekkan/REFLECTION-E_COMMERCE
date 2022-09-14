let adminPartials = true
let adminPartialsDont=true
module.exports = {

    adminHome: (req, res, next) => {
        res.render('admin/adminhome', { adminPartials,admin: req.session.admin })
        
    }
}