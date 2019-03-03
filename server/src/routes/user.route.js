import { Router } from 'express';
import { me, resetPassword, activateUser } from '../controllers/user.controller';

const router = Router();

router.get('/', me);
router.put('/resetPassword', resetPassword);
router.put('/activateUser', activateUser);

export default router;
