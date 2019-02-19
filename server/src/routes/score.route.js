import { Router } from 'express';
import {
  getScores,
  getUserScores,
  createScore,
} from '../controllers/score.controller';

const router = Router();

// GET Top scores in range
router.get('/scores/:range', getScores);

// GET specified userId's scores
router.get('/user/:userId', getUserScores);

// POST new score
router.post('/new', createScore);

export default router;
