const mongoose = require('mongoose'),
        Schema       = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String},
    email:{type:String},
    username:{type:String },
    business_name:{type:String},
    business_slug:{type:String},
    subDomain:{type:String},
    website: {type: String},
    country_code:{type:Number},
    currency_code:{type:String},
    mobile:{type:String},
    affiliateCode:{type:String},
    seller_affiliate_code:{type:String},
    password:{type:String},
    role:{type:String,enum: ['Admin', 'SubAdmin'], default:"Admin"},
    status:{type:String,enum: ['Active', 'Inactive', 'Block', 'Expired'], default:"Inactive"},
    validityUnit: {type:String, default:"Month"},
    validityValue: {type:String, default: 1},
    planStartDate: {type: Date},
    expiryDate:{type:Date},
    verified_at: { type: Date, default: null },
    verifyStatus:{type:String,enum:['Verified','Pending'],default:"Pending"},
    // created: { type: Date, default: Date.now },
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
