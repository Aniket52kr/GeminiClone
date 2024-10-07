import express from 'express';
import resultRouter from './routes/Result.js';
import userRouter from './routes/User.js';
import { connectDB } from './utils/DB.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 2000; // Use environment variable for port

// Database connection
connectDB();

// Middleware for parsing JSON requests
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow credentials if needed
}));

// Set Cross-Origin-Opener-Policy header
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
  });

// Root route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Routers
app.use('/api-v1/result', resultRouter);
app.use('/api-v1/user', userRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
