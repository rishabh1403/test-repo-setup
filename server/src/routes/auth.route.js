import { Router } from 'express';
import { signup, signin, validateEmailAccount } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/token/:token', validateEmailAccount);

export default router;
