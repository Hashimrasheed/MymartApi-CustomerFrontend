const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerAddressSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    address_name:{type:String},
    street: { type: String, required: true },
    business_slug:{type: String,required: true },
    additional_directions:{ type: String, required: false},
    mobile:{ type: String, required: true },
    building_no:{ type: String, required: true },
    // address_type:{ type: String, required: true},
    customer_id:{ type: String, required: true},
    lat:{type: String},
    long:{type: String},
    isDefault:{type:Boolean, default:false},
}, {timestamps:true})

module.exports = mongoose.model('CustomerAddress', customerAddressSchema)
