const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String},
    status: {type: Boolean, default: true },
    type: {type: String, enum: ['flat', 'percentage', 'deliveryCharge']},
    couponFor: {type: String, enum: ['all', 'special'], default: "all"},
    amount: {type: Number},
    min_order_amount:{ type: Number},
    categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    code: {type: String},
    start_date: {type: Date},
    end_date: {type: Date},
    usage_limit: {type: Number},
    total_usage:{ type: Number, default:0}, 
    business_slug:{type: String },
}, {timestamps:true})

module.exports = mongoose.model('Customer', customerSchema)
