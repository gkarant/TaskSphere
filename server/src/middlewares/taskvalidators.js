import { body } from 'express-validator';

export const validateTask = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').isLength({ min: 5 }).withMessage('Description must be atleast 5 characters'),
    body('projectId').isMongoId().withMessage('Invalid project Id')
];