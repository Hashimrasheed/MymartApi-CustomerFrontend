const mongoose = require('mongoose');
Schema = mongoose.Schema;
const adminsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, Required: true},
    email: {type: String, Required: true, unique: true},
    username: {type: String, Required: true, unique: true},
    mobile: {type: String, Required: true, unique: true},
    password: {type: String, Required: true},
    role: {type: String, enum: ['Admin', 'SubAdmin', 'Manager'], default: 'Admin'},
    status: {type: String, enum: ['Active', 'Inactive', 'Block'], default: 'Active'},
    assigned_sellers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    resetToken: {type: String},
    created: {
        type: Date,
        // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
    },
}, {timestamps: true});


module.exports = mongoose.model('Admin', adminsSchema);