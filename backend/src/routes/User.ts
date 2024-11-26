import express from 'express';
import { newUser, getUser, isExist } from '../controller/User.js';


const router = express.Router();

// Create a new user
router.post('/new', newUser);

// User login
router.post('/login', getUser);

// Check if user exists
router.post('/isuser', isExist);

// Get user data
router.get('/user', isExist);

export default router;
