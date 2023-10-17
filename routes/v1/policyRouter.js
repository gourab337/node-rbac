const router = require("express").Router();
const policyController = require("../../controller/policyController")

router.post('/addPolicy', policyController.addPolicy);
router.get('/getPolicy', policyController.getPolicy);
router.delete('/deletePolicy', policyController.deletePolicy);

module.exports = router