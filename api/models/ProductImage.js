const mongoose = require('mongoose'),
Schema       = mongoose.Schema;
const config = require('../config/constant');

const productImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_id: {type: Schema.Types.ObjectId, ref: 'Product'},
    type: {type: String, enum: ['main', 'other']},
    original_image:{type:String},
    main_image:{type:String},
    thumbnail_image: {type:String},
}, {
    timestamps:true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});

productImageSchema.virtual('main_image_url').get(function () {
    let url = `${config.Appurl}/product/${this.main_image}`
    return url;
})
productImageSchema.virtual('thumbnail_image_url').get(function () {
    let url = `${config.Appurl}/product/${this.thumbnail_image}`
    return url;
})

module.exports = mongoose.model('ProductImage', productImageSchema);