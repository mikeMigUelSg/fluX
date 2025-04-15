import mongoose from 'mongoose';

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB ligado");
  } catch (err) {
    console.error("Erro MongoDB:", err);
  }
};

export default connectDB;
