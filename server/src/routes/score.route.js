import { Router } from 'express';
import {
  getScores,
  getUserScores,
  createScore,
  getUserRank,
} from '../controllers/score.controller';

const router = Router();

// GET Top scores in range
router.get('/scores', getScores);

// GET User Rank
router.get('/rank', getUserRank);

// GET specified userId's scores
router.get('/user', getUserScores);

// POST new score
router.post('/new', createScore);

export default router;
