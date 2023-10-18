const { PolicyModel } = require('../models/PolicyModel');
const { UserModel } = require('../models/UserModel');


const checkPermission = async (req, res, next) => {
    // Fetching Roles and Permissions
    const roles = await PolicyModel.find({});
    // Fetching User 
    const user = await UserModel.findOne({email : req.user.email});
    if (!user) return res.status(401).send('Invalid credentials');

    let allowedActions = [];
    // O(n/2) = O(n) :(
    for(let i=0, j=roles.length-1; i<j; i++, j--) {
        if(roles[i].role === user.authority) {
            allowedActions.push(roles[i].action);
        }
        if(roles[j].role === user.authority) {
            allowedActions.push(roles[j].action);
        }
    }
    // Removing duplicates
    allowedActions = [...new Set(allowedActions)];
    req.user.allowedActions = allowedActions;

    let allowedResources = [];
    for(let i=0; i<roles.length; i++) {
        if(roles[i].role === user.authority) {
            allowedResources.push(roles[i].resource);
        }
    }
    allowedResources = [...new Set(allowedResources)];
    req.user.allowedResources = allowedResources;
    next();
}

module.exports = {
    checkPermission,
}

// The time complexity of checkPermission is O(n). We need a way to reduce this as we scale up since this will be called several times.