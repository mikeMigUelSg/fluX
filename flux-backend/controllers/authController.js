const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, inviteCode } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, inviteCode });
    await newUser.save();
    res.status(201).json({ message: "Utilizador criado com sucesso" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao registar utilizador" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};