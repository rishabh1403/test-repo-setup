import Score from '../models/score.model';

const queryScores = ({ offset, limit }) =>
  Score.find()
    .skip(offset)
    .sort({ value: -1 })
    .limit(limit)
    .populate('user', 'name');

const queryScoresCount = () => Score.countDocuments();

const queryUserScore = userId =>
  Score.find()
    .where('user', userId)
    .sort({ value: -1 })
    .limit(5)
    .populate('user', 'name');

const queryRank = async userId => {
  const userScores = await queryUserScore(userId);
  const score = userScores[0].value; // Get Highest Individual Score

  // Get rank by counting scores greater than its own for Unique users
  const greaterScores = await Score.distinct('value', { value: { $gt: score } });
  return greaterScores.length + 1; // Rank = number of Greater Scores + 1
};

const insertScore = (userId, value) => {
  const score = new Score({
    user: userId,
    value,
  });
  return score.save();
};

export { queryScores, queryUserScore, queryRank, insertScore, queryScoresCount };
