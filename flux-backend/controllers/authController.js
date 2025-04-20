import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// REGISTO
export const register = async (req, res) => {
  const { name, email, password, inviteCode } = req.body;
  try {
    console.log("📨 Dados recebidos no backend:", req.body);
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, inviteCode });
    await newUser.save();
    res.status(201).json({ message: "Utilizador criado com sucesso" });
  } catch (err) {
    console.error("ERR: Erro ao registar utilizador:", err);
    res.status(400).json({ error: "Erro ao registar utilizador" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Palavra-passe incorreta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login bem-sucedido",
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

// GUARDAR OU ATUALIZAR UM DISPOSITIVO
export const saveDeviceStats = async (req, res) => {
  const { uuid, model, cpuCores, ramGB, gpuModel, os, osVersion, ranking } = req.body;
  const userId = req.user.id;

  if (!uuid) {
    return res.status(400).json({ error: "UUID do dispositivo é obrigatório." });
  }

  try {
    const user = await User.findById(userId);   
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    const existingDevice = user.devices.find(d => d.uuid === uuid);

    if (existingDevice) {
      // Atualiza os dados existentes
      Object.assign(existingDevice, {
        model, cpuCores, ramGB, gpuModel, os, osVersion, ranking, available: true
      });
    } else {
      // Adiciona novo dispositivo
      user.devices.push({
        uuid, model, cpuCores, ramGB, gpuModel, os, osVersion, ranking, available: true
      });
    }

    await user.save();
    res.status(200).json({ message: "Dispositivo registado/atualizado com sucesso" });

  } catch (err) {
    console.error("Erro ao guardar dispositivo:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// OBTER STATS DE UM DISPOSITIVO ESPECÍFICO
export const getDeviceStats = async (req, res) => {
  const userId = req.user.id;
  const { uuid } = req.query;

  if (!uuid) return res.status(400).json({ error: "UUID do dispositivo é obrigatório." });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    const device = user.devices.find(d => d.uuid === uuid);

    if (!device || device.available === false) {
      return res.status(404).json({ error: "Dispositivo não encontrado ou inativo" });
    }

    res.status(200).json({ deviceStats: device });

  } catch (err) {
    console.error("Erro ao obter deviceStats:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// OBTER UTILIZADOR COMPLETO + TODOS OS DISPOSITIVOS
export const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    res.status(200).json({
      name: user.name,
      email: user.email,
      earnings: user.earnings,
      balance: user.balance,
      transactions: user.transactions,
      accelerators: user.accelerators,
      devices: user.devices
    });
  } catch (err) {
    console.error("Erro ao obter utilizador:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
