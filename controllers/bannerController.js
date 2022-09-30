let adminPartials = true;
let adminPartialsDont = true;
let submenuShowProduct = true;
module.exports = {
    viewHomePage: (req, res) => {
        res.render("index", { userDetails: req.session.user});
    },
    // adminAddPrimary
    bannerManageByAdmin: (req, res) => {
        res.render('admin/bannerManagement', {
            admin: req.session.admin,
            adminPartials,
            submenuShowProduct,
        })
    }
}