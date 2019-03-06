import { Router } from 'express';
import { signup, signin, forgetPassword, activateUser } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgetPassword', forgetPassword);
router.post('/activateUser', activateUser);

export default router;
