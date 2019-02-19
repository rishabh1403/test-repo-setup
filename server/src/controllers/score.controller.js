import constants from '../utils/contants';
import {
  queryScores,
  queryUserScore,
  insertScore,
} from '../utils/db_score_query';

const {
  HTTP_SUCCESS_OK,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_CREATED,
} = constants;

const getScores = async (req, res) => {
  const { range } = req.params;
  try {
    const scores = await queryScores(parseInt(range, 10));
    res.status(HTTP_SUCCESS_OK).json(scores);
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({
      error,
    });
  }
};

const getUserScores = async (req, res) => {
  const { userId } = req.params;
  try {
    const scores = await queryUserScore(userId);
    res.status(HTTP_SUCCESS_OK).json(scores);
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({
      error,
    });
  }
};

const createScore = async (req, res) => {
  const { userId, value } = req.body;
  try {
    const result = await insertScore(userId, value);
    res.status(HTTP_CREATED).json({
      message: 'POST to create user score',
      createdScore: result,
    });
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({
      error,
    });
  }
};

export { getScores, getUserScores, createScore };
