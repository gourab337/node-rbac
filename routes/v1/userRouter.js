const router = require("express").Router();
const userController = require("../../controller/userController");
const { authenticateToken } = require("../../middleware/auth");
const { checkPermission } = require("../../middleware/permission");

router.get('/user', authenticateToken, checkPermission, userController.getUserContent);
router.get('/admin', authenticateToken, checkPermission, userController.getAdminContent);
router.post('/newUser', authenticateToken, checkPermission, userController.createUser);

module.exports = router