const { NotFoundError } = require('../errors/notFound.error');

module.exports = (req, res, next) => {
    try {
        throw new NotFoundError('Not Found');
    } catch (err) {
        next(err);
    }
}