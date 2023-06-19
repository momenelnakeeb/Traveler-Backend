const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/auth.error');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new AuthError('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthError('Token is missing');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    next(err);
  }
};
