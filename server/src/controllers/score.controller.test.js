import constants from '../utils/constants';

// All DB functions to be mocked
import {
  queryScores,
  queryScoresCount,
  queryRank,
  queryUserScore,
  insertScore,
} from '../utils/db_score_query';

// All Score Controllers
import { getScores, getUserRank, getUserScores, createScore } from './score.controller';

const { HTTP_SUCCESS_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_CREATED } = constants;

// Mock DB query module
jest.mock('../utils/db_score_query');

// Constants to be used in Tests
const sampleScore = [{ id: 'something', value: 20 }];
const sampleScoresCount = 50;
const sampleRank = 2;
const error = new Error('Query Failed');

// Mocked DB functions
queryScores.mockImplementation(async ({ offset, limit }) => {
  if (offset && limit) {
    return sampleScore;
  }
  throw error;
});

queryScoresCount.mockImplementation(async () => sampleScoresCount);

queryRank.mockImplementation(async userId => {
  if (userId) {
    return sampleRank;
  }
  throw error;
});

queryUserScore.mockImplementation(async userId => {
  if (userId) {
    return sampleScore;
  }
  throw error;
});

insertScore.mockImplementation(async (userId, value) => {
  if (userId && value) {
    return sampleScore;
  }
  throw error;
});

describe('Score API controllers', () => {
  const req = {
    body: {
      userId: '5abc',
      value: 30,
    },
    query: {
      offset: '2',
      limit: '10',
      userId: '5abc',
    },
  };
  const res = {
    responseStatus: '',
    jsonData: '',
    status(statusCode) {
      this.responseStatus = statusCode;
      const json = data => {
        this.jsonData = data;
      };
      return { json };
    },
  };

  describe('getScores GET Controller', () => {
    describe('SUCCESS', () => {
      beforeEach(() => {
        getScores(req, res);
      });

      it('should query scores from DB with offset and limit', () => {
        const offset = parseInt(req.query.offset, 10);
        const limit = parseInt(req.query.limit, 10);
        expect(queryScores).toBeCalledWith({ offset, limit });
      });

      it('should query scores count from DB', () => {
        expect(queryScoresCount).toBeCalled();
      });

      it('should set HTTP STATUS OK on success', () => {
        expect(res.responseStatus).toEqual(HTTP_SUCCESS_OK);
      });

      it('should send scores in response on success', () => {
        expect(res.jsonData[0]).toEqual(sampleScore);
      });

      it('should send Scores Count in response', () => {
        expect(res.jsonData[1]).toEqual(sampleScoresCount);
      });
    });

    describe('FAILURE', () => {
      beforeEach(() => {
        req.query.offset = null; // To create error
        getScores(req, res);
      });

      it('should set HTTP SERVER ERROR on fail', () => {
        expect(res.responseStatus).toEqual(HTTP_INTERNAL_SERVER_ERROR);
      });

      it('should send error in response on fail', () => {
        expect(res.jsonData.error).toEqual(error);
      });
    });
  });

  describe('getUserRank GET Controller', () => {
    describe('SUCCESS', () => {
      beforeEach(() => {
        getUserRank(req, res);
      });

      it('should query DB with userID', () => {
        expect(queryRank).toBeCalledWith(req.query.userId);
      });

      it('should set HTTP STATUS OK on success', () => {
        expect(res.responseStatus).toEqual(HTTP_SUCCESS_OK);
      });

      it('should send Rank on success', () => {
        expect(res.jsonData).toEqual(sampleRank);
      });
    });

    describe('FAILURE', () => {
      beforeEach(() => {
        req.query.userId = null; // To create error
        getUserRank(req, res);
      });

      afterEach(() => {
        req.query.userId = '5abc'; // Restore after error Testing
      });

      it('should set HTTP SERVER ERROR on fail', () => {
        expect(res.responseStatus).toEqual(HTTP_INTERNAL_SERVER_ERROR);
      });

      it('should send error in response on FAILURE', () => {
        expect(res.jsonData.error).toEqual(error);
      });
    });
  });

  describe('getUserScores GET Controller', () => {
    describe('SUCCESS', () => {
      beforeEach(() => {
        getUserScores(req, res);
      });

      it('should call db function with userID', () => {
        expect(queryUserScore).toBeCalledWith(req.query.userId);
      });

      it('should set HTTP STATUS OK on success', () => {
        expect(res.responseStatus).toEqual(HTTP_SUCCESS_OK);
      });

      it('should send scores in response on success', () => {
        expect(res.jsonData).toEqual(sampleScore);
      });
    });

    describe('FAILURE', () => {
      beforeEach(() => {
        req.query.userId = null; // To create error
        getUserScores(req, res);
      });

      it('should set HTTP SERVER ERROR on fail', () => {
        expect(res.responseStatus).toEqual(HTTP_INTERNAL_SERVER_ERROR);
      });

      it('should send error in response on fail', () => {
        expect(res.jsonData.error).toEqual(error);
      });
    });
  });

  describe('createScore POST Controller', () => {
    describe('SUCCESS', () => {
      beforeEach(() => {
        createScore(req, res);
      });

      it('should call db function with userId and value', () => {
        expect(insertScore).toBeCalledWith(req.body.userId, req.body.value);
      });

      it('should set HTTP CREATED status on success', () => {
        expect(res.responseStatus).toEqual(HTTP_CREATED);
      });

      it('should send the created score as response on success', () => {
        expect(res.jsonData).toEqual(sampleScore);
      });
    });

    describe('FAILURE', () => {
      beforeEach(() => {
        req.body.value = null; // To create error
        createScore(req, res);
      });

      it('should set HTTP SERVER ERROR on fail', () => {
        expect(res.responseStatus).toEqual(HTTP_INTERNAL_SERVER_ERROR);
      });

      it('should send error in response on fail', () => {
        expect(res.jsonData.error).toEqual(error);
      });
    });
  });
});
