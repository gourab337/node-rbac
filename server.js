const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { encrypt, decrypt } = require('./encrypt');
const dbConn = require('./dbConnection/mongoConnect');
const { UserModel } = require('./models/UserModel');
const bcrypt = require('bcrypt');

const app = express();
const port = 4000;

app.use(bodyParser.json());

// Secret key to sign JWT tokens
const secretKey = `u_K/'}L10o4E8%&XHCe,*zC~5Yn4wD`;

// Authentication middleware
const authenticateToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).send('Unauthorized');
        jwt.verify(token, secretKey, (err, encryptedData) => {
            if (err) return res.status(403).send('Forbidden');
            let decryptedData = decrypt(encryptedData);
            decryptedData = JSON.parse(decryptedData);
            req.user = decryptedData;
            next();
        });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err})
    }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/generateToken', async (req, res) => {
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
});

  
app.get('/user', authenticateToken, (req, res) => {
    try {
        if (req.user.authority === 'user') {
            res.send('User Content');
          } else {
            res.status(403).send('Forbidden');
          }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }
});
  
app.get('/admin', authenticateToken, (req, res) => {
    try {
        if (req.user.authority === 'admin') {
            res.send('Admin Content');
          } else {
            res.status(403).send('Forbidden');
          }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }   
});

app.post('/newUser', async (req, res) => {
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
});