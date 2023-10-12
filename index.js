const express = require('express');
const app = express();
const verify = require("./verify")
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', verify, (req, res) => {
    res.send("Allowed");
});

app.listen(4000, () => console.log('Listening on port 4000...'));