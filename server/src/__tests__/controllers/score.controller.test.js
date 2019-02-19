import constants from '../../utils/contants';

// All DB functions to be mocked
import {
  queryScores,
  queryUserScore,
  insertScore,
} from '../../utils/db_score_query';

// All Score Controllers
import {
  getScores,
  getUserScores,
  createScore,
} from '../../controllers/score.controller';

const {
  HTTP_SUCCESS_OK,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_CREATED,
} = constants;

// Mock DB query module
jest.mock('../../utils/db_score_query');

const sampleScore = [{ id: 'something', value: 20 }];
const error = new Error('Query Failed');

// Mocked DB function to get scores in range
queryScores.mockImplementation(async (range) => {
  if (range) {
    return sampleScore;
  }
  throw error;
});

queryUserScore.mockImplementation(async (userId) => {
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
    params: {
      range: 2,
      userId: '5abc',
    },
  };
  const res = {
    responseStatus: '',
    jsonData: '',
    status(statusCode) {
      this.responseStatus = statusCode;
      const json = (data) => {
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

      it('should call db function with range', () => {
        expect(queryScores).toBeCalledWith(parseInt(req.params.range, 10));
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
        req.params.range = null; // To create error
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

  describe('getUserScores GET Controller', () => {
    describe('SUCCESS', () => {
      beforeEach(() => {
        getUserScores(req, res);
      });

      it('should call db function with userID', () => {
        expect(queryUserScore).toBeCalledWith(req.params.userId);
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
        req.params.userId = null; // To create error
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
        const postResponse = {
          message: 'POST to create user score',
          createdScore: sampleScore,
        };
        expect(res.jsonData).toEqual(postResponse);
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
