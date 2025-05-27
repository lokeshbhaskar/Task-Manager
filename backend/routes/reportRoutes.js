import express from 'express'
import { adminOnly, protect } from '../middlewares/authMiddleware.js';
import { exportTaskReports, exportUsersReports } from '../controllers/reportControllers.js';

const router = express.Router();

router.get("/export/tasks",protect,adminOnly, exportTaskReports);
router.get("/export/users",protect,adminOnly, exportUsersReports);

export default router;