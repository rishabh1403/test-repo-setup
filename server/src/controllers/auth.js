import User from '../models/user';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await new User({ name, email, password });
    await user.validate();
    await user.hashPassword();
    await user.save();
    const token = await user.generateAuthToken();
    return res
      .status(201)
      .header('x-auth', token)
      .send({ user });
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return res.header('x-auth', token).send(user);
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
};
