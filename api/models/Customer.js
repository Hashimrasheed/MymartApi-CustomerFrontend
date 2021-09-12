const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String},
    status: {type: Boolean, default: true },
    email:{type:String},
    password:{type:String},
    mobile: {type: String },
    business_slug:{type: String },
    customer_type:{ type: String, enum: ['Guest', 'Registered'], default:"Guest"},
    address: [{ type: Schema.Types.ObjectId,ref: 'CustomerAddress'}]
}, {timestamps:true})

module.exports = mongoose.model('Customer', customerSchema)
