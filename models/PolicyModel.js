const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

const PolicySchema = new Schema({ 
    role: { type: String },
    action: { type: String },
    resource: { type: String },
});

const PolicyModel = mongoose.model('policy', PolicySchema);

module.exports = {
    PolicyModel
};