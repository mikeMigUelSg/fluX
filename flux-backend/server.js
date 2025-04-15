import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import connectDB from './config/db.js';



dotenv.config();

console.log("🧪 Loaded MONGO_URI:", process.env.MONGO_URI);
connectDB(process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));