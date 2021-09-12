const Setting = require('../models/Setting');
const User = require('../models/User');
const constant = require('../config/constant');

exports.settings = async (req, res, next) => {
    let matchParameter = {
        business_slug: req.query.business_slug
    }
    try {
        let result = await Setting.findOne(matchParameter);
        let setting = {
            _id: result.id,
            logo: result.logo,
            logopath: result.logopath,
            store_name: result.store_name,
            business_slug: result.business_slug,
            delivery_time: result.delivery_time,
            tag_line: result.tag_line,
            address: {
                address_line1: result.address.address_line1,
                address_line2: result.address.address_line2,
                landmark: result.address.landmark,
                city: result.address.city,
                state: result.address.state,
                country: result.address.country,
                zipcode: result.address.zipcode,
            },
            email: result.email,
            contact_no: result.contact_no,
            social_links: {
                facebook: result.social_links.facebook.link,
                instagram: result.social_links.instagram.link,
                snapchat: result.social_links.snapchat.link,
                twitter: result.social_links.twitter.link,
                whatsapp: result.social_links.whatsapp.link,
                countryCode: result.social_links.countryCode
            },
            remark: result.remark,
            status: result.status,
            min_order_price: result.min_order_price,
            store_publish: result.store_publish,
            plan_expired: result.plan_expired,
            original_logo: result.original_logo,
            main_image: result.main_image,
            thumbnail_image: result.thumbnail_image,
            main_image_url: result.main_image_url,
            thumbnail_image_url: result.thumbnail_image_url,
            image_url: result.image_url,
            time_slots: result.time_slots,
            pickup: result.pickup ? result.pickup : false,
            delivery: result.delivery ? result.delivery : false,
            scheduling: result.scheduling ? result.scheduling : false,
            location_map_url: result.location_map_url ? result.location_map_url : "",
            original_favicon: result.original_favicon,
            favicon: result.favicon,
            button_color: result.button_color,
            primary_color: result.primary_color,
            secondary_color: result.secondary_color,
            favicon_url: result.favicon_url,
            googleClientId: result.googleClientId,
            facebookAppId: result.facebookAppId,
            chat_script: result.chat_script,
            google_analytic: result.google_analytic,
            cash: result.cash,
            seo:result.seo
        }
        if (setting) {
            return res.status(200).json({
                status_code: 200,
                setting: setting,
                message: "Setting fetch successfully",
            });
        } else {
            return res.status(500).json({
                status_code: 400,
                message: "Settings not updated",
                errors: err
            })
        }
    } catch (err) {
        return res.status(500).json({
            status_code: 400,
            message: "Something went wrong",
            errors: err
        })
    }
}

exports.getStoreLogo = async (req, res, next) => {
    let domain = req.query.website
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0];
    let orCondition = [{domain_name: domain}];
    // console.log(domain);
    if (domain.endsWith(constant.primarydomain)) {
        let subdomain = domain.substr(
            0,
            +domain.lastIndexOf(constant.primarydomain) - 1
        );
        orCondition.push({sub_domain: subdomain});
    }
    User.findOne({$or: orCondition})
        .select("business_slug business_type")
        .exec()
        .then(async(result) => {
            if (result) {
                let matchParameter = {
                    business_slug: result.business_slug
                }
                try {
                    let result = await Setting.findOne(matchParameter);
                    let datas = {
                        logo: result.thumbnail_image_url,
                        store_name: result.store_name
                    }
            
                    if(datas){
                        return res.status(200).json({
                            status_code: 200,
                            storeData: datas,
                            message: "Setting fetch successfully",
                        });
                    } else {
                        return res.status(500).json({
                            status_code: 400,
                            message: "Settings not updated",
                            errors: err
                        }) 
                    }
                } 
                catch (err) {
                    return res.status(500).json({
                        status_code: 400,
                        message: "Something went wrong",
                        errors: err
                    })
                }
            } 
        })
        .catch((err) => {
            return res.status(500).json({
                status_code: 400,
                message: "Something went wrong",
                err: err,
            });
        });
}