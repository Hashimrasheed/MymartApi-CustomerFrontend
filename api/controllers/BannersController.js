const Banner = require('../models/Banner');
const User = require('../models/User');
const { ImageUrl } = require('../config/constant');

exports.get_all = async(req, res, next) => {
    try {
        let userId = await User.findOne({ business_slug: req.query.business_slug }).select('_id').exec();
    Banner.find({ business_slug: req.query.business_slug })
        .then(result => {
            let response = {
                Banners: [{
                    main_image_url: `${ImageUrl}/img/no_image_mobile.jpg`,
                    image_url: `${ImageUrl}/img/no_image_mobile.jpg`,
                    mobile_image_url: `${ImageUrl}/img/no_image_mobile.jpg`,
                    tag_line: ""
                }]
            }
            console.log(result.length)

            if (result.length) {
                response = {
                    Banners: result.map(result => {
                        let mobile_image_url = `${ImageUrl}/img/no_image_mobile.jpg`
                        if (result.mobile_banner) {
                            mobile_image_url = `${ImageUrl}/banner/${userId._id}/${result.mobile_banner}`
                        }
                        let image_url = `${ImageUrl}/img/no_image_mobile.jpg`
                        if (result.original_image) {
                            image_url = `${ImageUrl}/banner/${userId._id}/${result.original_image}`;
                        }
                        return {
                            main_image_url: result.main_image_url,
                            image_url: image_url,
                            mobile_image_url: mobile_image_url,
                            tag_line: result.tag_line,
                            banner_url: result.banner_url,
                        }
                    })
                }
            }
            res.status(200).json({
                status_code: 200,
                data: response,
                message: (result.length) ? "Record fetched Successfully" : "No Match Found",
            });
        })
        .catch(err => {
            return res.status(400).json({
                status_code: 400,
                message: "Something went wrong",
                errors: err.message
            })
        });
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: "Something went wrong",
            errors: error.message
        })
    }
    
}