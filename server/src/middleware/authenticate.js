import User from '../models/user';

const authenticate = async (req, res, next) => {
  const token = req.header('x-auth');
  try {
    const user = await User.findByToken(token);
    if (!user) {
      throw new Error('invalid token');
    }
    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    return res.status(401).send({ error: error.toString() });
  }
};

export default authenticate;
