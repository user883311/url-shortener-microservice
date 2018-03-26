module.exports = function asyncMiddleware(handler) {
    /* This function handles all my routes and provides a 
    generic error handling solution with a try/catch block. */
    return (req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            next(ex);
        }
    };
};