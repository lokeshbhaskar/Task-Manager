import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { createTask, deleteTask, getDashboardData, getTaskById, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from "../controllers/taskControllers.js";

const router = express.Router();

// Task Management Routes
router.get("/dashboard-data",protect, getDashboardData );
router.get("/user-dashboard-data",protect, getUserDashboardData );
router.get("/",protect, getTasks );
router.get("/:id",protect,getTaskById)
router.post("/",protect,adminOnly, createTask )
router.put("/:id",protect, adminOnly,updateTask )
router.delete("/:id",protect, adminOnly, deleteTask )
router.put("/:id/status",protect, updateTaskStatus )
router.put("/:id/todo",protect, updateTaskChecklist )

export default router;