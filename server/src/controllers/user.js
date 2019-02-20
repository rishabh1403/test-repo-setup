export const me = (req, res) => {
  const { user } = req;
  res.status(200).json({ user });
};

export default me;
