const services = require('../services/categoryHelpers')
const path = require('path')
const console = require('console')


let adminPartials = true
let adminPartialsDont = true
let submenuShow = true


module.exports = {
    adminViewCategory: (req, res, next) => { 
        services.adminViewCategory().then((response) => { 
            let { parentCategories, categories } = response
            console.log(parentCategories);
            res.render('admin/category', {
                parentCategories,
                categories,
                adminPartials,
                admin: req.session.admin,
                submenuShow,
                categorIsCheck:req.session.categorIsCheck
                
            })
            req.session.categorIsCheck = false
            // console.log(categories);
        })
        
    },
    adminAddCategory: (req, res) => {
        services.addCategory(req.body,req.file.path).then((response) => {
            if (response.status) {
                req.session.categorIsCheck = true
            }
            else {
                res.redirect('/admin/category')
            }
           
        })
        
    },
    admindelete: (req, res) => {
        let CategoryId = req.params.id
        services.deleteCategory(CategoryId).then(() => { 
            res.redirect('/admin/category')
            
        })
        
    },
    adminupdate: (req, res) => { 
        let CategoryId = req.params.id

        try {
            if (req.file.path) {
                services.updateCategory(CategoryId, req.params.cloud_id, req.body,req.file.path,).then(() => {
                    res.redirect('/admin/category')
                
                })
            }
            else {
                services.updateCategory(CategoryId, req.params.cloud_id, req.body,).then(() => {
                    res.redirect('/admin/category')
                
                })
            }
            
        } catch (error) {
            services.updateCategory(CategoryId, req.params.cloud_id, req.body,).then(() => {
                res.redirect('/admin/category')
            
            })
        }
        
    },
    blockCategory: (req, res) => {
        services.blockCategory(req.params.id).then((data) => res.status(200).json(data))
        .catch(()=>res.send(404));
    },

    adminViewBrand: (req, res) => { 
        services.adminViewBrand().then((brands) => {
            res.render('admin/brands', {
                adminPartials,
                submenuShow,
                brands
            })
        })
        
    },
    adminAddBrand: (req, res, next) => {
       
        services.adminAddBrand(req.body, req.file.path).then(() => { 
            res.redirect('/admin/brands')
        })
    
    },
    adminDeleteBrand: (req, res, next) => { 
        services.adminDeleteBrand(req.params.id).then(() => {
            res.redirect('/admin/brands')
        })

    },
    adminUpdateBrand: (req, res, next) => { 
        let brandLogo
        if (req.file) {
            brandLogo = req.file.path
            
        } else {
            brandLogo=false    
        }
        services.adminUpdateBrand(req.body, brandLogo, req.params.id).then(() => {
            res.redirect('/admin/brands');
         })
    },
    adminviewParentCategory: (req, res) => {
        services.adminviewParentCategory().then((parentCategories) => {
            
            res.render('admin/parentCategory', {
                adminPartials,
                submenuShow,
                parentCategories
            })
        }).catch(()=> { res.send(404); });
        
    },
    adminManageParentCategory: (req, res) => {
        if (req.params.id === req.params.id2) {
         
            services.blockParentCategory(req.params.id).then((data) => res.status(200).json(data))
            .catch(()=>res.send(404));
        }
        else {
           

            services.adminAddParentCategory(req.body, req.file.path,req.params.id,req.params.id2).then(() => {
                res.redirect('/admin/parent-category');
        }).catch(()=>res.send('501 error'))
        }
       
    },
    stateManageParentCategory: (req, res) => {
        if (req.params.id === req.params.id2) {
            services.adminManageParentCategory(req.params.id).then(() => {
                res.redirect('/admin/parent-category');
        }).catch(()=>res.send(501))
        }
        
    } 
    
}