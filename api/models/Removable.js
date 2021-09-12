var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema;

var removableSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String },
    business_slug: { type: String, ref: 'User' },
    status:{type:String, enum: ['Active', 'Inactive'], default:"Active"}
}, {timestamps:true});

module.exports = mongoose.model('Removable', removableSchema);