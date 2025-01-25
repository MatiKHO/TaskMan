const express = require("express");
const { ensureAuthenticated } = require('../middlewares/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus
} = require("../controllers/taskController");
const router = express.Router();

router.get("/tasks", ensureAuthenticated, getTasks);
router.get("/tasks/:id/edit", ensureAuthenticated, getTaskById);
router.get("/tasks/create", ensureAuthenticated, (req, res) => {
  res.render('createTask', { layout: 'main' });
});
router.post("/tasks", ensureAuthenticated, createTask);
router.put("/tasks/:id", ensureAuthenticated, updateTask);
router.delete("/tasks/:id/delete", ensureAuthenticated, deleteTask);
router.post("/tasks/:id/toggle", ensureAuthenticated, toggleTaskStatus);
module.exports = router;
