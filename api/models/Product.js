var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const General = new Schema({
    name: { type: String, intl: true }, /** This field is required */
    description: { type: String, intl: true },
    product_tag: [{ type: String }]
}, { _id: false, isArrayValidatorError: false });

var selectionPrice = mongoose.Schema({
    title: { type: String },
    price: { type: Number },
    isDiscountable: { type: Boolean, default: false },
    specialPrice: { type: Number },
    discountPercentage: { type: Number },
});

const Model = new Schema({
    model: { type: String }, /** This field is required */
    price: { type: String },
    isDiscountable: { type: Boolean, default: false },
    specialPrice: { type: Number },
    discountPercentage: { type: Number },
    selection_price_type: {type: String, enum: ['selection_price', 'normal'], default: "normal"},
    selected_price: [selectionPrice],
    // quantity: { type: Number, default: 0 },
    // subtract_stock: { type: Boolean, default: false },
    lastEditAt: Date,
}, { _id: false, isArrayValidatorError: false })

const Links = new Schema({
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], /** This field is required */
    related_product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { _id: false, isArrayValidatorError: false });

const AddOnsValueSchema = new Schema({
    option_id: { type: Schema.Types.ObjectId, ref: 'AddOnsValue' },
    price: { type: Number },
    order: { type: Number }
});

var AddOnsTypesSchema = mongoose.Schema({
    required: {
        type: Boolean,
        default: false
    },
    type: { type: String, enum: ['single', 'multiple'], default: "single" },
    option_group_id: { type: Schema.Types.ObjectId, ref: 'AddOnsType' },
    title: { type: String },
    order: { type: Number },
    options: [AddOnsValueSchema]
});

const AdditionalImage = new Schema({
    image: { type: String },
    original_image: { type: String },
    thumbnail: { type: String }
})

const Image = new Schema({
    main_image: { type: String },
    original_image: { type: String },
    main_image_thumbnail: { type: String },
    additional_image: [AdditionalImage]
}, { _id: false, isArrayValidatorError: false });

var productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_type: { type: String, enum: ['Best Sellers', 'Featured', 'New', 'Add Ons'], default: "New" },
    general: General,
    model: Model,
    links: Links,
    product_add_ons: [AddOnsTypesSchema],
    removable: [{ type: Schema.Types.ObjectId, ref: 'Removable' }],
    image: Image,
    status: { type: Boolean, default: true },
    business_slug: { type: String },
    order_no: { type: Number },
}, { timestamps: true });

AdditionalImage.virtual("main_image_url").get(function () {
    let url = `${config.ImageUrl}/product/${this.image}`
    return url;
});

Image.virtual("main_image_url").get(function () {
    let url = `${config.ImageUrl}/product/${this.main_image}`
    return url;
});

AdditionalImage.virtual("thumbnail_image_url").get(function () {
    let url = `${config.ImageUrl}/product/${this.thumbnail}`
    return url;
});

Image.virtual("thumbnail_image_url").get(function () {
    let url = `${config.ImageUrl}/product/${this.main_image_thumbnail}`
    return url;
});


module.exports = mongoose.model('Product', productSchema);