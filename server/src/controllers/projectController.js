import Project from "../models/Project.js";

//create a project
export const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//get all projects

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//get a single project by ID

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'project not found' });
        res.json(project);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// update project 

export const updateProject = async (req, res) => {
    try {

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProject) return res.status(404).json({ error: 'project not found' });
        res.json(updatedProject)

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//delete a project
export const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ error: 'project not found' });
        res.json({ message: 'project deleted' })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}