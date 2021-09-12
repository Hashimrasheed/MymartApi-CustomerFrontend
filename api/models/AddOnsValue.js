var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddOnsValueSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type : {type: Schema.Types.ObjectId, ref: 'AddOnsType'},
    business_slug: {type: String},
    name: {type: String, intl: true},
}, {timestamps: true});


module.exports = mongoose.model('AddOnsValue', AddOnsValueSchema);

