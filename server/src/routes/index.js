import authRouter from './auth.route';
import authenticate from '../middleware/authenticate';
import userRouter from './user.route';
import scoreRouter from './score.route';

const setupRoutes = app => {
  app.use('/auth', authRouter);
  app.use('/api', authenticate);
  app.use('/api/me', userRouter);
  app.use('/api/leaderboard', scoreRouter);
};

export default setupRoutes;
