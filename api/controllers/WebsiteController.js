const User = require("../models/User");
const constant = require("../config/constant");

exports.fetch_business_slug = async (req, res, next) => {
    try {
        let domain = req.query.website
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0];
    let orCondition = [{domain_name: domain}];
    if (domain.endsWith(constant.primarydomain)) {
        let subdomain = domain.substr(
            0,
            +domain.lastIndexOf(constant.primarydomain) - 1
        );
        orCondition.push({subDomain: subdomain});
    }
    console.log(orCondition)

    User.findOne({$or: orCondition})
        .select("business_slug business_type")
        .exec()
        .then((result) => {
            if (result) {
                res.status(200).json({
                    status_code: 200,
                    business_slug: result.business_slug,
                    business_type: result.business_type,
                    message: "Business slug fetch successfully",
                });
            } else {
                return res.status(500).json({
                    status_code: 400,
                    message: "Something went wrong",
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                status_code: 400,
                message: "Something went wrong",
                err: err.message,
            });
        });
    } catch (error) {
        return res.status(500).json({
            status_code: 400,
            message: "Something went wrong",
            err: error.message,
        });
    }
    
};