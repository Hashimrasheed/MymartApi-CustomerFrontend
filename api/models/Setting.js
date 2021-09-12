const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const config = require('../config/constant')
const settingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    logo: { type: String },
    logopath: { type: String },
    store_name: { type: String },
    business_slug: { type: String },
    delivery_time: { type: String },
    address: {
        address_line1: { type: String },
        address_line2: { type: String },
        landmark: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipcode: { type: String },
    },
    email: { type: String },
    contact_no: { type: String },
    social_links: {
        facebook: { link: { type: String }, display: { type: Boolean, default: false } },
        instagram: { link: { type: String }, display: { type: Boolean, default: false } },
        snapchat: { link: { type: String }, display: { type: Boolean, default: false } },
        twitter: { link: { type: String }, display: { type: Boolean, default: false } },
        whatsapp: { link: { type: String }, display: { type: Boolean, default: false } },
    },
    store_timings: [{ day: { type: String }, open_time: { type: String }, close_time: { type: String } }],
    time_slots: [{ label: String, open_time: String, close_time: String }],
    status: { type: String, enum: ['Open', 'Busy', 'Close'], default: "Open" },
    min_order_price: { type: Number },
    store_publish: { type: Boolean, default: false },
    pickup: { type: Boolean, default: false },
    delivery: { type: Boolean, default: false },
    // scheduling: {type: Boolean, default: false},
    // cash: {type: Boolean,default:true},
    original_logo: { type: String },
    main_image: { type: String },
    thumbnail_image: { type: String },
    main_image_url: { type: String },
    thumbnail_image_url: { type: String },
    original_favicon: { type: String },
    favicon: { type: String },
    primary_color: { type: String },
    secondary_color: { type: String },
    button_color: { type: String },
    plan_expired: { type: Boolean, default: false },
    new: { type: Boolean, default: true },
    featured: { type: Boolean, default: true },
    best_sellers: { type: Boolean, default: true },
    freeDeliveryApplicable: { type: Boolean, default: false },
    minOrderAmountForDelivery: { type: String },
}, { timestamps: true });

settingSchema.virtual('image_url').get(function () {
    url = `${config.Appurl}/setting/${this._id}/${this.thumbnail_image}`;
    return url;
}).set(function (v) {
    return v;
})
settingSchema.virtual('favicon_url').get(function () {
    let url = `${config.Appurl}/setting/${this._id}/${this.favicon}`
    return url;
})


module.exports = mongoose.model('Setting', settingSchema);
