const { PolicyModel } = require('../models/PolicyModel');

const addPolicy = async (req, res) => {
    try {
        const { role, action, resource } = req.body;
        const policy = {
            role: role,
            action: action,
            resource: resource,
        };
        try{
            await PolicyModel(policy).save();
            res.status(200).send({ message: `Policy ${policy.role} created successfully!`});

        } catch(err) {
            res.status(500).send({ message: `Failed to create policy with error: ${err.message}`});
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }
}

const getPolicy = async (req, res) => {
    try {
        const policies = await PolicyModel.find({});
        res.status(200).send({ policies });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }
}

const deletePolicy = async (req, res) => {
    try {
        const { role, action, resource } = req.body;
        const policy = {
            role: role,
            action: action,
            resource: resource,
        };
        try{
            await PolicyModel.deleteOne(policy);
            res.status(200).send({ message: `Policy ${policy.role} deleted successfully!`});

        } catch(err) {
            res.status(500).send({ message: `Failed to delete policy with error: ${err.message}`});
        }
    } catch(err) {
        res.status(500).send({ message: "Internal Server Error", details: err});
    }

}

module.exports = {
    addPolicy,
    getPolicy,
    deletePolicy
}