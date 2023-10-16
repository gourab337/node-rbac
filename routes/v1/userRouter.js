const router = require("express").Router();
const userController = require("../../controller/userController");
const { authenticateToken } = require("../../middleware/auth");

router.get('/user', authenticateToken, userController.getUserContent);
router.get('/admin', authenticateToken, userController.getAdminContent);
router.post('/newUser', userController.createUser);

module.exports = router