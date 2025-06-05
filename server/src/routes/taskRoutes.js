import express from "express";
import { createTask, getTasks, getTaskSummary } from "../controllers/taskController.js";
import { validateTask } from "../middlewares/taskvalidators.js";
import { validationResult } from "express-validator";

const router = express.Router();

// router.route('/')
//     .post(createTask)
//     .get(getTasks);

router.post('/', validateTask, createTask);
router.get('/', getTasks);
//router.get('/:projectId', getTasksByProject);// route parameter (GET /api/tasks/6836e41e61f82ccc30a54de4 )
//router.get('/', getTasksByProject);

router.get('/summary', getTaskSummary);

export default router;