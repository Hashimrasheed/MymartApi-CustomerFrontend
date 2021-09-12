const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var prodListSchema = mongoose.Schema(
  {
    productName:{type:String},
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number },
    amount: { type: Number },
    manufacturer: {type:String },
    categories: [{type:String }],
    isDiscountable: { type: Boolean, default: false },
    specialPrice: { type: Number },
    discountPercentage: { type: Number },
    selectdVarientId: { type: Schema.Types.ObjectId},
    selectedSubVarientId: { type: Schema.Types.ObjectId},
    optionType: {type:String },
    optionValue: {type:String },
    invertedOptionType: {type:String },
    invertedOptionValue: {type:String },
    displayImage:  {type: String},
    thumbnail_image_url: {type: String},
    product_link: {type:String},

    productAddOns: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    product_add_on_name: [{type:String}],
    productAddOnPrice: { type: Number },
    removable: [{ type: Schema.Types.ObjectId, ref: "Removable" }],
    removableName: [{type:String}],
    removablePrice: { type: Number },
    // selection_size: { type: String },
  },
  { _id: false }
);

const customerOrderSchema = new Schema(
  {
    order_no: { type: String },
    business_slug: { type: String },
    customer_info: { type: Schema.Types.ObjectId, ref: "Customer" },
    method: { type: String },
    paid_amount: { type: Number },
    // promo_code: { type: String },
    delivery_charge: {type: Number, default: 0},
    discount_amount: {type: Number, default: 0},
    status: { type: String },
    order_note: { type: String },
    // order_type: { type: String, default: "Now" },
    order_class: { type: String, enum: ['Delivery', 'Pickup'], default: "Delivery" },
    pickUpLocation: { type: Schema.Types.ObjectId },
    // scheduleDate: { type: Date },
    // scheduleTime: { type: String },
    product_list: [prodListSchema],
    address: {
      address_name:{type:String},
      street: { type: String },
      business_slug:{type: String },
      additional_directions: { type: String },
      mobile: { type: String },
      // address_type: { type: String },
      building_no: { type: String },
      lat: { type: String },
      long: { type: String },
      isDefault:{type:Boolean, default:false},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerOrder", customerOrderSchema);
