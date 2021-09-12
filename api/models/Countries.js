var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema;

var countrySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String},
    countryCode:{type:String},
    currencyCode:{type:String},
    status:{type:Boolean,default:true}
});

module.exports = mongoose.model('Countries', countrySchema);