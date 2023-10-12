const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { encrypt, decrypt } = require('./encrypt');

const app = express();
const port = 4000;

app.use(bodyParser.json());

// Secret key to sign JWT tokens
const secretKey = `u_K/'}L10o4E8%&XHCe,*zC~5Yn4wD`;

// Sample user data with roles
const users = [
  { id: 1, username: 'user1', password: 'password1', role: 'user' },
  { id: 2, username: 'admin', password: 'adminpassword', role: 'admin' },
];

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

app.post('/generateToken', (req, res) => {
    try{
        const { username, password } = req.body;
        const user = users.find((u) => u.username === username && u.password === password);
        if (!user) return res.status(401).send('Invalid credentials');
        let payloadData = { id: user.id, username: user.username, role: user.role };
        payloadData = JSON.stringify(payloadData);
        const encryptedData = encrypt(payloadData);
        const token = jwt.sign( encryptedData, secretKey);
        res.json({ token });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }
});
  
  app.get('/user', authenticateToken, (req, res) => {
    try {
        if (req.user.role === 'user') {
            res.send('User Content');
          } else {
            res.status(403).send('Forbidden');
          }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err})
    }
});
  
  app.get('/admin', authenticateToken, (req, res) => {
    try {
        if (req.user.role === 'admin') {
            res.send('Admin Content');
          } else {
            res.status(403).send('Forbidden');
          }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err})
    }   
});

  
