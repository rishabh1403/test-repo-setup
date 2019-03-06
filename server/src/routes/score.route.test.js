import fetch from 'node-fetch';
import { startServer } from '../server';
import Score from '../models/score.model';
import {
  users,
  populateUsers,
  emptyUsers,
  populateCollection,
  emptyCollection,
} from '../utils/seed';

describe('Leaderboard APIs and DB fetch', async () => {
  let tokens;
  let server;
  let baseUrl;
  let generateUrl;
  const sampleUser = {
    value: 20,
  };
  // To be saved in DB before running GET API request Tests
  const DBScores = [
    {
      user: users[0]._id, // eslint-disable-line no-underscore-dangle
      value: 20,
    },
    {
      user: users[0]._id, // eslint-disable-line no-underscore-dangle
      value: 18,
    },
    {
      user: users[1]._id, // eslint-disable-line no-underscore-dangle
      value: 15,
    },
  ];

  beforeAll(async () => {
    server = await startServer({ port: 8798 });
    baseUrl = `http://localhost:${server.address().port}`;
    generateUrl = addUrl => `${baseUrl}${addUrl}`;
    tokens = await populateUsers();
  });

  afterAll(async () => {
    await emptyUsers();
    await server.close();
  });

  describe('POST API api/leaderboard/new', () => {
    afterAll(async () => {
      await emptyCollection(Score);
    });

    it('should return score on successful save', async () => {
      const url = generateUrl('/api/leaderboard/new');
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(sampleUser),
        headers: {
          'Content-Type': 'application/json',
          'x-auth': tokens[0],
        },
      });
      const responseData = await res.json();
      expect(responseData.value).toEqual(sampleUser.value);
    });
  });

  describe('Leaderboard GET APIs', () => {
    beforeAll(async () => {
      await populateCollection(Score, DBScores);
    });

    afterAll(async () => {
      await emptyCollection(Score);
    });

    describe('GET /api/leaderboard/scores', () => {
      let res;
      let responseData;
      const limit = 1;
      beforeAll(async () => {
        const url = generateUrl(`/api/leaderboard/scores?offset=0&limit=${limit}`);
        res = await fetch(url, {
          headers: {
            'x-auth': tokens[0],
          },
        });
        responseData = await res.json();
      });

      it('should get total Scores count in DB', async () => {
        const receivedTotalScoresCount = responseData[1];
        const savedTotalScoresCount = DBScores.length;
        expect(receivedTotalScoresCount).toEqual(savedTotalScoresCount);
      });

      it('should get number of scores specified by limit in query', () => {
        const receivedScores = responseData[0];
        expect(receivedScores.length).toEqual(limit);
      });
    });

    describe('GET /api/leaderboard/rank', () => {
      it('should get User Rank', async () => {
        // This User whose token is used, has first highest score
        const expectedRank = 1;
        const url = generateUrl(`/api/leaderboard/rank`);
        const res = await fetch(url, {
          headers: {
            'x-auth': tokens[0],
          },
        });
        const userRank = await res.json();
        expect(userRank).toEqual(expectedRank);
      });
    });

    describe('GET /api/leaderboard/user', () => {
      let scoreCard;
      beforeAll(async () => {
        const url = generateUrl(`/api/leaderboard/user`);
        const res = await fetch(url, {
          headers: {
            'x-auth': tokens[0],
          },
        });
        const responseData = await res.json();
        [scoreCard] = responseData;
      });

      it('should get the the user scores', async () => {
        const receivedUserScore = scoreCard.value;
        const savedUserScore = DBScores[0].value;
        expect(receivedUserScore).toEqual(savedUserScore);
      });

      it('should get username with score', () => {
        const receivedUsername = scoreCard.user.name;
        const savedUsername = users[0].name;
        expect(receivedUsername).toBe(savedUsername);
      });
    });
  });
});
