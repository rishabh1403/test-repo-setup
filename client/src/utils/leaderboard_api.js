import { get } from './api';

const leaderboardRoute = '/api/leaderboard';

const getUsersAndPageCount = async ({ currentPage }) => {
  const MAX_PAGE_COUNT = 5;
  const MAX_SCORE_COUNT_PER_PAGE = 10;

  const fetchedData = await get(`${leaderboardRoute}/scores`, {
    offset: (currentPage - 1) * MAX_SCORE_COUNT_PER_PAGE,
    limit: 10,
  });

  // User Data Structure
  const scores = fetchedData.data[0];
  const users = scores.map((userInfo, index) => ({
    name: userInfo.user.name,
    score: userInfo.value,
    rank: index + 1 + (currentPage - 1) * MAX_SCORE_COUNT_PER_PAGE,
  }));

  // Page count based on score count, Max 5 Pages
  const scoresCount = fetchedData.data[1];
  const pageCount = scoresCount > MAX_PAGE_COUNT * MAX_SCORE_COUNT_PER_PAGE
    ? MAX_PAGE_COUNT
    : Math.ceil(scoresCount / MAX_SCORE_COUNT_PER_PAGE);
  return [users, pageCount];
};

const getPersonalScore = async () => {
  const fetchedData = await get(`${leaderboardRoute}/user`);
  const personalScores = fetchedData.data;
  if (personalScores[0]) {
    const personalHighScore = personalScores[0].value;
    return personalHighScore;
  }
  return 0;
};

const getPersonalRank = async () => {
  // Needs refactoring based on server side fixes
  try {
    const fetchedPersonalRank = await get(`${leaderboardRoute}/rank`);
    return fetchedPersonalRank.data;
  } catch (error) {
    return 0;
  }
};

export { getUsersAndPageCount, getPersonalScore, getPersonalRank };
