var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const config = require('../config/constant');

var categorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cat_name: {type: String},
    business_slug: {type: String, ref: 'User'},
    display_home: {type: Boolean, default: false},
    original_image: {type: String},
    thumbnail_image: {type: String},
    status: {type: Boolean, default: true},
    order_no: {type: Number,default: 0}
}, {timestamps: true});


categorySchema.virtual('image_url').get(function () {
    let url = ""
    if (this.thumbnail_image) {
        url = `${config.Appurl}/category/${this.thumbnail_image}`
    }
    return url;
})

module.exports = mongoose.model('Category', categorySchema);