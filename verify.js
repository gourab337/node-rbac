// DATABASE CONNECTION
const conn = {
    john123: 1,
    max123: 2,
    kate123: "1"
}

module.exports = (req, res, next) => {
    //console.log(req.body.id, conn[req.body.id]);
    if(conn[req.body.id]===1) {
        return next();
    }
    if(conn[req.body.id]!==1) {
        return res.send("Not Allowed");
    }
};