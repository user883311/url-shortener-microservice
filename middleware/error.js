module.exports = function(err, req, res, next){
    // Log the exception
    res.status(500).send("The operation failed.", err);
};