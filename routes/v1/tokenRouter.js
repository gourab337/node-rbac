const router = require("express").Router();
const tokenController = require("../../controller/tokenController")

router.post('/generateToken', tokenController.generateToken);

module.exports = router