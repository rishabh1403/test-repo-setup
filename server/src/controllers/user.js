import { httpStatuses } from '../utils/contants';

export const me = (req, res) => {
  const { user } = req;
  res.status(httpStatuses.SUCCESS_OK_200).json({ user });
};

export default me;
