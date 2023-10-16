const jwt = require('jsonwebtoken');
const { decrypt } = require('../lib/encrypt');
require('dotenv').config();

// Secret key to sign JWT tokens
const secretKey = process.env.JWT_SIGNING_KEY;

const authenticateToken = async (req, res, next) => {
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

module.exports = {
    authenticateToken,
}