import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending',
        index: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        index: true,
    },
    projectId: { // link to project
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    //Add these fields for future use
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,//optional for now
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, //optional for now
    }

}, {
    timestamps: true,
});

export default mongoose.model('Task', taskSchema);