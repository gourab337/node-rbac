const mongoose = require('mongoose');
require('dotenv').config();

main().catch(err => console.log(err));

async function main() {
  try{
    await mongoose.connect(process.env.MONGO_CONN_STRING);
    console.log("Connected to DB");
  } catch (err) {
    console.log(`Error connecting to DB with error: ${err.message}`)
  } 
}