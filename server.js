const express = require('express');

const bodyParser = require('body-parser');
const dbConn = require('./dbConnection/mongoConnect');
const tokenRouter = require('./routes/v1/tokenRouter');
const userRouter = require('./routes/v1/userRouter');
const policyRouter = require('./routes/v1/policyRouter');

require('dotenv').config();

const app = express();
const port = 4000;

app.use(bodyParser.json());

// token
app.use('/v1', tokenRouter);

// user
app.use('/v1', userRouter);

// policy
app.use('/v1', policyRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});