import { Router } from 'express';
import { me, resetPassword } from '../controllers/user.controller';

const router = Router();

router.get('/', me);
router.put('/resetPassword', resetPassword);

export default router;
