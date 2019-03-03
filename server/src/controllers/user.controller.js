import { httpStatuses } from '../utils/constants';

// eslint-disable-next-line
export const me = (req, res) => {
  const { user } = req;
  res.status(httpStatuses.SUCCESS_OK_200).json({ user });
};
