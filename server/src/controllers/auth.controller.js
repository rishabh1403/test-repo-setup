import User from '../models/user.model';
import { sendWelcomeEmailWithToken } from '../config/mailer';
import { isTest } from '../config/index';
import { httpStatuses } from '../utils/constants';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.createUser({ name, email, password });
    const token = user.generateToken();
    if (!isTest) {
      const mailTo = email;
      sendWelcomeEmailWithToken({ token, mailTo });
    }
    const successMessage = 'Please verify your mail address and signin';
    return res.status(httpStatuses.CREATED_201).send({ message: successMessage });
  } catch (error) {
    return res.status(httpStatuses.BAD_REQUEST_400).send({ error: error.toString() });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user.active) {
      throw new Error('validate account before signin');
    }
    const token = await user.generateToken();
    return res.header('x-auth', token).send({ user });
  } catch (error) {
    return res.status(httpStatuses.BAD_REQUEST_400).send({ error: error.toString() });
  }
};

export const validateEmailAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findByToken(token);
    user.active = true;
    await user.save();
    return res.header('x-auth', token).send({ user });
  } catch (error) {
    return res.status(httpStatuses.BAD_REQUEST_400).send({ error: error.toString() });
  }
};
