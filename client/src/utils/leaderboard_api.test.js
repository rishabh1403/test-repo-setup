import { get } from './api';
import { getUsersAndPageCount, getPersonalScore, getPersonalRank } from './leaderboard_api';

const leaderboardRoute = '/api/leaderboard';

jest.mock('./api');

const sampleScoresCount = 2;
const sampleRank = 2;
const sampleScores = [
  {
    user: {
      name: 'firstUser',
    },
    value: 20,
  },
  {
    user: {
      name: 'secondUser',
    },
    value: 15,
  },
];

const sampleUsers = [
  {
    name: 'firstUser',
    score: 20,
    rank: 1,
  },
  {
    name: 'secondUser',
    score: 15,
    rank: 2,
  },
];

get.mockImplementation(async (endpoint) => {
  let dataToSend;
  if (endpoint === `${leaderboardRoute}/scores`) {
    dataToSend = [sampleScores, sampleScoresCount];
  }

  if (endpoint === `${leaderboardRoute}/user`) {
    dataToSend = sampleScores;
  }

  if (endpoint === `${leaderboardRoute}/rank`) {
    dataToSend = sampleRank;
  }

  return {
    data: dataToSend,
  };
});

describe('Leaderboard data manipulation Helper functions', () => {
  describe('getUsersAndPageCount', () => {
    let fetchedData;
    beforeAll(async () => {
      fetchedData = await getUsersAndPageCount({ currentPage: 1 });
    });

    it('should return an array of length two', () => {
      expect(fetchedData.length).toBe(2);
    });

    it('should have users in returned array', () => {
      expect(fetchedData[0]).toEqual(sampleUsers);
    });

    it('should have Page Count in returned array', () => {
      // For 2 Users, Page Count will be 2
      expect(fetchedData).toContain(1);
    });
  });

  describe('getPersonalScores', () => {
    it('should return High Score for specified user', async () => {
      const score = await getPersonalScore({ userId: '' });
      expect(score).toBe(sampleScores[0].value);
    });
  });

  describe('getPersonalRank', () => {
    it('should return Rank for specified user', async () => {
      const rank = await getPersonalRank({ userId: '' });
      expect(rank).toBe(2);
    });
  });
});
