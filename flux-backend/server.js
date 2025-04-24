import express from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB(process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// 🔐 Carrega o certificado SSL gerado com mkcert para o IP local
/*const httpsOptions = {
  key: fs.readFileSync('./ssl/192.168.1.100-key.pem'),
  cert: fs.readFileSync('./ssl/192.168.1.100.pem'),
};
*/
const httpsOptions = {
  key: fs.readFileSync('./ssl/172.20.10.9-key.pem'),
  cert: fs.readFileSync('./ssl/172.20.10.9.pem'),
};

const PORT = process.env.PORT || 4000;

// 🚀 Arranca o servidor HTTPS em todas as interfaces de rede
https.createServer(httpsOptions, app).listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor HTTPS a correr em https://192.168.1.100:${PORT}`);
});
