import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true

    },
    description: {
        type: String,

    },
    Status: {
        type: String,
        enum: ['active', 'completed', 'on-hold'],
        default: 'active',
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,

    },

},
    { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;