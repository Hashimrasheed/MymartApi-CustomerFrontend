const Category = require('../models/Category');

exports.get_all = async (req, res, next) => {
    Category.find({business_slug:req.query.business_slug, status:true}).sort({ order_no: 1 })
    .then(result=>{
        const response = {
            category: result.map(result=>{
                return {
                    cat_name: result.cat_name,
                    _id: result._id
                }
            })
        }
             res.status(200).json({
                status_code:200,
                data:response,
                message: (result.length)?"Record fetched Successfully":"No Match Found", 
            });
    })
    .catch(err=>{
        return res.status(500).json({
            status_code:400,
            message: "Something went wrong",
            errors: err
        })
    });
}
