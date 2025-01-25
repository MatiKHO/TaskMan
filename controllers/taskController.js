const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;
    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                userId: req.user.id,
            },
        });
        req.flash('success_msg', 'Tarea creada exitosamente');
        res.redirect('/api/tasks');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al crear la tarea');
        res.redirect('/api/tasks/create');
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.user.id },
        });
        res.render('tasks', { tasks, layout: 'main' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
        });
        if (task) {
            task.dueDate = task.dueDate.toISOString().split('T')[0]; // Formatear la fecha
            res.render('editTask', { task });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    
    try {
        await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                completed: completed === 'on',
            },
        });
        res.redirect('/api/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
        });
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        await prisma.task.delete({
            where: { id: parseInt(id) },
        });
        res.redirect('/api/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};

const toggleTaskStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
        });
        if (!task) {
            req.flash('error_msg', 'Tarea no encontrada');
            return res.redirect('/api/tasks');
        }
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                completed: !task.completed,
            },
        });
        req.flash('success_msg', 'Estado de la tarea actualizado');
        res.redirect('/api/tasks');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al actualizar el estado de la tarea');
        res.redirect('/api/tasks');
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus,
};