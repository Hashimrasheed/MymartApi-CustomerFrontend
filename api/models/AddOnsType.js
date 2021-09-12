var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var addOnsTypeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    business_slug: { type: String },
    name: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model('AddOnsType', addOnsTypeSchema);
