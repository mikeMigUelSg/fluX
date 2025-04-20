import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

// controllers/user.js
export const saveDeviceStats = async (req, res) => {
  const { deviceStats } = req.body;
  const userId = req.user.id;

  if (!deviceStats) {
    return res.status(400).json({ error: "Faltam dados do dispositivo." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { deviceStats:deviceStats },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    res.status(200).json({ message: "Estatísticas do dispositivo guardadas com sucesso" });
  } catch (err) {
    console.error("Erro ao guardar deviceStats:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getDeviceStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    const stats = user.deviceStats || {};
    if (stats.available === false) {
      return res.status(405).json({ error: "Estatísticas do dispositivo não encontradas" });
    }
    res.status(200).json({ deviceStats: stats });
  } catch (err) {
    console.error("Erro ao obter deviceStats:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getUser = async (req, res) => {
  console.log("📨 Dados recebidos no backend:", req.body);
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }
  res.status(200).json({
    name: user.name,
    email: user.email,
    earnings: user.earnings,
    balance: user.balance,
    transactions: user.transactions,
    accelerators: user.accelerators,
    deviceStats: user.deviceStats
  });
};