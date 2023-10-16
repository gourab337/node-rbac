const { UserModel } = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { encrypt } = require('../lib/encrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key to sign JWT tokens
const secretKey = process.env.JWT_SIGNING_KEY;

const generateToken = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await UserModel.findOne({email : email});
        if (!user) return res.status(401).send('Invalid credentials');
        bcrypt.compare(password, user.password, (bcrypt_err, result) => {
            if(bcrypt_err) {
                return res.status(500).send({ message: "Internal Server Error", details: bcrypt_err});
            }
            if(!result) {
                res.status(500).send({ message: "Invalid Credentials"});
            } else {
                let payloadData = { patient_id: user.patient_id, policyholder_id: user.policyholder_id, user_type: user.user_type, full_name: user.full_name, email: user.email, phone: user.phone, status: user.status, authority: user.authority, department: user.department, profile_pic: user.profile_pic, join_date: user.join_date, login_mode: user.login_mode};
                payloadData = JSON.stringify(payloadData);
                const encryptedData = encrypt(payloadData);
                const token = jwt.sign( encryptedData, secretKey, { expiresIn: '15m' });
                res.json({ token });
            }
        });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }
};

module.exports = {
    generateToken
}