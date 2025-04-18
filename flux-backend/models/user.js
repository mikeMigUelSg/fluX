import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  inviteCode: { type: String, default: "" },

  // Ganhos acumulados
  earnings: {
    total: { type: Number, default: 0 },              // total geral
    fromTasks: { type: Number, default: 0 },           // tarefas AI (texto/imagem)
    fromCompute: { type: Number, default: 0 }          // aluguer de CPU/GPU
  },

  // Histórico de compras de aceleradores
  accelerators: [{
    name: String,                   // Ex: "Tensor Booster", "Edge AI Core"
    price: Number,
    purchasedAt: { type: Date, default: Date.now }
  }],

  // Estatísticas do dispositivo (opcional)
  deviceStats: {
    model: String , 
    cpuCores: Number,
    ramGB: Number,
    gpuModel: String,
    os: String,
    osVersion: String,
    ranking: Number,
    available: { type: Boolean, default: false }
  }
  ,

  createdAt: { type: Date, default: Date.now }
});



export default mongoose.model('User', userSchema);