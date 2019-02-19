import Score from '../models/score.model';

const queryScores = range => Score
  .find()
  .sort({ value: -1 })
  .limit(range)
  .exec();
  // exec() is used to get a Promise
  // Mongoose queries return a thenable object, but it isn't a Promise
  // https://mongoosejs.com/docs/promises.html#queries-are-not-promises

const queryUserScore = userId => Score
  .find()
  .where('user', userId)
  .exec();

const insertScore = (userId, value) => {
  const score = new Score({
    user: userId, value,
  });
  return score
    .save();
};

export { queryScores, queryUserScore, insertScore };
