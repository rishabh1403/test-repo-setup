import { Router } from 'express';
import { me } from '../controllers/user.controller';

const router = Router();

router.get('/', me);

export default router;
