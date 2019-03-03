import { Router } from 'express';
import { signup, signin, forgetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgetPassword', forgetPassword);

export default router;
