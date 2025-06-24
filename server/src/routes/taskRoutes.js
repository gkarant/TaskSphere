import express from "express";
import { createTask, getTasks, getTaskSummary } from "../controllers/taskController.js";
import { validateTask } from "../middlewares/taskvalidators.js";
import { validationResult } from "express-validator";
import { authenticate, authorizeRole } from "../middlewares/authMiddleware.js";
const router = express.Router();

// router.route('/')
//     .post(createTask)
//     .get(getTasks);

router.post('/', authenticate, authorizeRole('admin', 'manager'), validateTask, createTask);
router.get('/', authenticate, getTasks);
//router.get('/:projectId', getTasksByProject);// route parameter (GET /api/tasks/6836e41e61f82ccc30a54de4 )
//router.get('/', getTasksByProject);

router.get('/summary', authenticate, authorizeRole('admin', 'manager', 'lead'), getTaskSummary);

export default router;