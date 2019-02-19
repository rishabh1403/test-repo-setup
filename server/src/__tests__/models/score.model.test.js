import Score from '../../models/score.model';

describe('leaderboard schema validation', () => {
  it('should be invalid if user id is empty', () => {
    const score = new Score({ score: 5 });
    score.validate((error) => {
      expect(error.errors).toHaveProperty('user');
    });
  });

  it('should be invalid if score is empty', () => {
    const score = new Score({ username: 'Test' });
    score.validate((error) => {
      expect(error.errors).toHaveProperty('value');
    });
  });
});
