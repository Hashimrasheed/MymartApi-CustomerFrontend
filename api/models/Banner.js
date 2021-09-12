var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const config = require('../config/constant');
const bannerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tag_line: { type: String },
    type: { type: String },
    business_slug: { type: String, ref: 'User' },
    original_image: { type: String },
    banner_url: { type: String },
    main_image: { type: String },
    thumbnail_image: { type: String },
    main_image_url: { type: String },
    thumbnail_image_url: { type: String },
    mobile_banner: { type: String },
    mobile_banner_url: { type: String },
    status: { type: Boolean, default: false }
}, { timestamp: true });

bannerSchema.virtual('image_url').get(function() {
    let url = `${config.Appurl}/img/no_image_mobile.jpg`
    if (this.thumbnail_image_url) {
        url = `${config.Appurl}/${this.thumbnail_image_url}`
    }
    return url;
})

bannerSchema.virtual('mobile_image_url').get(function() {
    let url = `${config.Appurl}/${this.mobile_banner_url}`
    return url;
})

module.exports = mongoose.model('Banner', bannerSchema);