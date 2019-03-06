import { httpStatuses } from '../utils/constants';

export const me = (req, res) => {
  const { user } = req;
  res.status(httpStatuses.SUCCESS_OK_200).json({ user });
};

export const resetPassword = async (req, res) => {
  try {
    const { user } = req;
    const { password } = req.body;
    user.password = password;
    await user.validate();
    await user.hashPassword();
    await user.save();
    return res.send({ message: 'password changed successfully' });
  } catch (error) {
    return res.status(httpStatuses.BAD_REQUEST_400).send({ error: error.toString() });
  }
};
