const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
    patient_id: { type: String },
    policyholder_id: { type: String },
    user_type: { type: String },
    full_name: { type: String },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    status: { type: String },
    authority: { type: String },
    department: { type: String },
    profile_pic: { type: String },
    join_date: { type: Date },
    login_mode: { type: String },
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = {
    UserModel
};