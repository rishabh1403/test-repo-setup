import User from '../models/user.model';
import { httpStatuses } from '../utils/constants';

const authenticate = async (req, res, next) => {
  const token = req.header('x-auth');
  try {
    const user = await User.findByToken(token);
    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    return res.status(httpStatuses.UNAUTHORIZED_401).send({ error: error.toString() });
  }
};

export default authenticate;
