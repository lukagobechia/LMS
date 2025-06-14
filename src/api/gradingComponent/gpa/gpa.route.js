import express from 'express';
import { authGuard } from '../../../middlewares/auth.middleware.js';
import { roleGuard } from '../../../middlewares/role.middleware.js';
import { getGpaPerCourse, getCumulativeGpa } from './gpa.service.js';

const router = express.Router();

router.get(
  '/my/gpa-per-course',
  authGuard,
  roleGuard('student'),
  async (req, res) => {
    try {
      const gpaData = await getGpaPerCourse(req.user.userId);
      res.json(gpaData);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.get(
  '/my/gpa-cumulative',
  authGuard,
  roleGuard('student'),
  async (req, res) => {
    try {
      const cumulativeGpa = await getCumulativeGpa(req.user.userId);
      res.json(cumulativeGpa);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

export default router;
