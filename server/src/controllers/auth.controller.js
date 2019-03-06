import User from '../models/user.model';
import { sendWelcomeEmailWithToken, sendResetPasswordEmailWithToken } from '../config/mailer';
import { httpStatuses } from '../utils/constants';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.createUser({ name, email, password });
    const token = user.generateToken();
    sendWelcomeEmailWithToken({ token, mailTo: email });
    const successMessage = 'Please verify your mail address';
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

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`no user exist with email ${email}`);
    }
    const token = await user.generateToken();
    sendResetPasswordEmailWithToken({ token, mailTo: email });
    return res.send({ message: 'check your mails for link to reset password' });
  } catch (error) {
    return res.status(httpStatuses.BAD_REQUEST_400).send({ error: error.toString() });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findByToken(token);
    user.active = true;
    await user.save();
    return res.send({ data: { message: 'email successfully verified' } });
  } catch (error) {
    return res.status(httpStatuses.BAD_REQUEST_400).send({ error: error.toString() });
  }
};
