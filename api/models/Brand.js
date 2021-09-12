var mongoose = require('mongoose')
const config = require('../config/constant');

const brandSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, intl: true},
    slug: {type: String},
    business_slug: {type: String, ref: 'User'},
    original_image: {type: String},
    thumbnail_image: {type: String},
    status: {type: Boolean, default: false}
}, {toObject: { virtuals: true }});

brandSchema.virtual('image_url').get(function () {
    let url = `${config.Appurl}/brand/${this.thumbnail_image}`
    return url;
})

module.exports = mongoose.model('Brand', brandSchema);
