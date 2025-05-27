import express from 'express'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'
import {  getUserById, getUsers } from '../controllers/userControllers.js';

const router = express.Router()

// User management Routes 
router.get("/",protect,adminOnly, getUsers);
router.get("/:id", protect,getUserById);


export default router;