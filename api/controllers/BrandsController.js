const Brand = require('../models/Brand');

exports.get_all = async (req, res, next) => {
    Brand.find({ business_slug: req.query.business_slug, status: true })
        .then(result => {
            console.log(result)
            const response = {
                brands: result.map(result => {
                    return {
                        name: result.name,
                        slug: result.slug,
                        image_url: result.image_url,
                        _id: result._id
                    }
                })
            }
            res.status(200).json({
                status_code: 200,
                data: response,
                message: (result.length) ? "Record fetched Successfully" : "No Match Found",
            });
        })
        .catch(err => {
            return res.status(500).json({
                status_code: 400,
                message: "Something went wrong",
                errors: err
            })
        });
}
