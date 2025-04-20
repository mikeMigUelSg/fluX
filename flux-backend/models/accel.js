import mongoose from 'mongoose';

const AcceleratorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  levelRange: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deadlineDays: {
    type: Number,
    required: true
  },
  dailyTrainingHours: {
    type: Number,
    required: true
  },
  dailyEarnings: {
    type: Number,
    required: true
  },
  totalEarnings: {
    type: Number,
    required: true
  },
  totalYieldPercent: {
    type: Number,
    required: true
  },
  maxPurchase: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Accelerator', AcceleratorSchema, 'acceleratos');
