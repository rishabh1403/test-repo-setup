import User from '../models/user';
import Mailer from '../config/mailer';
import { serverPort, isTest } from '../config/index';
import { httpStatuses } from '../utils/contants';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.createUser({ name, email, password });
    const token = user.generateToken();
    if (!isTest) {
      try {
        const msg = {
          to: email,
          from: 'adityasmksaxena@gmail.com',
          subject: 'Sneaky Snakes Account Email Verification',
          text: `Hi ${name},`,
          html: `<p>Click on the link to verify email account</ br><a href="http://localhost:${serverPort}/auth/token/${token}"></a></p>`,
        };
        await Mailer.send(msg);
      } catch (error) {
        throw new Error('error sending verification mail');
      }
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
