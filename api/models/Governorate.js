var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema;

var governorateSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    country_id:{type:mongoose.Schema.Types.ObjectId,ref:'Countries'},
    name: {type:String},
    status:{type:Boolean,default:true}
});

module.exports = mongoose.model('Governorate', governorateSchema);
