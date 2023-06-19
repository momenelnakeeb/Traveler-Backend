const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/auth.error');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
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
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    if (!user.isSupervisor) {
      throw new AuthError('User is not a supervisor');
    }

    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    next(err);
  }
};
