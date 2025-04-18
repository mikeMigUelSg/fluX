// server.js
import fs   from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import connectDB from './config/db.js';

dotenv.config();

// Conexão à base de dados
console.log("🧪 Loaded MONGO_URI:", process.env.MONGO_URI);
connectDB(process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Carrega chave e certificado
const httpsOptions = {
  key:  fs.readFileSync(new URL('../key.pem', import.meta.url)),
  cert: fs.readFileSync(new URL('../cert.pem', import.meta.url)),
};

const PORT = process.env.PORT || 4000;
https.createServer(httpsOptions, app)
     .listen(PORT, '0.0.0.0', () => {
       console.log(`🚀 Servidor HTTPS a correr em https://localhost:${PORT}`);
     });
