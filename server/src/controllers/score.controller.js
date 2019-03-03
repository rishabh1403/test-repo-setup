import constants from '../utils/constants';
import {
  queryScores,
  queryScoresCount,
  queryRank,
  queryUserScore,
  insertScore,
} from '../utils/db_score_query';

const { HTTP_SUCCESS_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_CREATED } = constants;

const sendResultOrError = async ({ query, successStatus, errorStatus, res }) => {
  try {
    const result = await query;
    res.status(successStatus).json(result);
  } catch (error) {
    res.status(errorStatus).json({
      error,
    });
  }
};

const getScores = async (req, res) => {
  const { offset, limit } = req.query;
  const scores = queryScores({ offset: parseInt(offset, 10), limit: parseInt(limit, 10) });
  const scoresCount = queryScoresCount();
  sendResultOrError({
    query: Promise.all([scores, scoresCount]),
    successStatus: HTTP_SUCCESS_OK,
    errorStatus: HTTP_INTERNAL_SERVER_ERROR,
    res,
  });
};

const getUserRank = async (req, res) => {
  const { userId } = req.query;
  sendResultOrError({
    query: queryRank(userId),
    successStatus: HTTP_SUCCESS_OK,
    errorStatus: HTTP_INTERNAL_SERVER_ERROR,
    res,
  });
};

const getUserScores = async (req, res) => {
  const { userId } = req.query;
  sendResultOrError({
    query: queryUserScore(userId),
    successStatus: HTTP_SUCCESS_OK,
    errorStatus: HTTP_INTERNAL_SERVER_ERROR,
    res,
  });
};

const createScore = async (req, res) => {
  const { userId, value } = req.body;
  sendResultOrError({
    query: insertScore(userId, value),
    successStatus: HTTP_CREATED,
    errorStatus: HTTP_INTERNAL_SERVER_ERROR,
    res,
  });
};

export { getScores, getUserRank, getUserScores, createScore };
