const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB ligado"))
  .catch(err => console.error("Erro MongoDB:", err));

module.exports = mongoose;