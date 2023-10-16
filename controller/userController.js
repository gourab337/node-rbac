const { UserModel } = require('../models/UserModel');
const bcrypt = require('bcrypt');

const getUserContent = (req, res) => {
    try {
        if (req.user.authority === 'user') {
            res.send('User Content');
          } else {
            res.status(403).send('Forbidden');
          }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }
};

const getAdminContent = (req, res) => {
    try {
        if (req.user.authority === 'admin') {
            res.send('Admin Content');
          } else {
            res.status(403).send('Forbidden');
          }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }   
}; 

const createUser = async (req, res) => {
    try {
        const { patient_id, policyholder_id, user_type, full_name, email, phone, password, status, authority, department, profile_pic, join_date, login_mode } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            patient_id: patient_id,
            policyholder_id: policyholder_id,
            user_type: user_type,
            full_name: full_name,
            email: email,
            phone: phone,
            password: hashedPassword,
            status: status,
            authority: authority,
            department: department,
            profile_pic: profile_pic,
            join_date: join_date,
            login_mode: login_mode
        };
        try{
            await UserModel(user).save();
            res.status(200).send({ message: `User ${user.email} created successfully!`});

        } catch(err) {
            res.status(500).send({ message: `Failed to create user with error: ${err.message}`});
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }
}

module.exports = {
    getUserContent,
    getAdminContent,
    createUser
}