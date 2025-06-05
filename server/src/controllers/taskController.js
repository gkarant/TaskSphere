import Task from "../models/Task.js";
import redisClient from "../config/redis.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, projectId } = req.body;

        //basic validation
        if (!projectId) return res.status(400).json({ error: 'projectId is required' });

        const task = await Task.create({ title, description, priority, status, projectId });
        res.status(201).send(task);

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
};

export const getTasks = async (req, res, next) => {
    try {
        console.log('getTasks');
        //1. Extract pagintion parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        //build filter object
        const filter = {};
        if (req.query.projectId) filter.projectId = req.query.projectId;
        if (req.query.status) filter.status = req.query.status;
        //if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

        //build sort object
        let sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':');
            sort[field] = order === 'desc' ? -1 : 1;
        }
        const tasks = await Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        //count total documents for pagination info
        const totalTasks = await Task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / limit);

        //send the response
        res.status(200).json({
            totalTasks,
            currentPage: page,
            totalPages,
            tasks,
        });
    } catch (err) {
        // res.status(500).json({ message: err.message }); instead pass it to errorHandler
        next(err)
    }

};

export const getTaskSummary = async (req, res) => {
    try {
        const cacheKey = 'task_summary';

        //check if summary is cached
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        //if not cached, aggregate from db
        const summary = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    total: { $sum: 1 }
                }
            }
        ]);

        //cache the result for 5 min
        await redisClient.setEx(cacheKey, 300, JSON.stringify(summary));

        res.json(summary);
    } catch (err) {
        console.error('Task summery errr:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// export const getTasksByProject = async (req, res) => {
//     console.log('hi')
//     try {
//         const { projectId } = req.params.projectId;
//         console.log('hi' + projectId)
//         const TasksByProject = await Task.find({ projectId: projectId });
//         console.log('hi' + TasksByProject)
//         res.jsin(TasksByProject);

//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// };