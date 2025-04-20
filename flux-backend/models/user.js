import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  inviteCode: { type: String, default: "" },

  // Ganhos acumulados
  earnings: {
    total: { type: Number, default: 0 },
    fromTasks: { type: Number, default: 0 },
    fromCompute: { type: Number, default: 0 },
    fromTeam: { type: Number, default: 0 }
  },

  // Saldo atual disponível
  balance: { type: Number, default: 0 },

  // Histórico de transações
  transactions: [{
    type: { type: String, enum: ['ganho', 'gasto', 'levantamento', 'compra'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }],

  // Histórico de compras de aceleradores
  accelerators: [{
    name: String,
    price: Number,
    purchasedAt: { type: Date, default: Date.now }
  }],

  // Lista de dispositivos identificados por UUID
  devices: [{
    uuid: { type: String, required: true },
    model: String,
    cpuCores: Number,
    ramGB: Number,
    gpuModel: String,
    os: String,
    osVersion: String,
    ranking: Number,
    available: { type: Boolean, default: false },
    registeredAt: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
