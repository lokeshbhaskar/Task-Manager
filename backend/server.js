import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import path from 'path';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import { fileURLToPath } from "url";



configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//middleware to handle
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: [ "GET","POST","PUT","DELETE"],
        allowedHeaders:[ 'content-Type', 'Authorization' ]
    })
)

//middleware
app.use(express.json());

//connect database
connectDB();

//Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/reports",reportRoutes);

//serve uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

//start server
const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send("✅ Backend API is running!");
// });

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));
