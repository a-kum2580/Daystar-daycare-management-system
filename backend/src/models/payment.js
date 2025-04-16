const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tuition', 'salary', 'supplies', 'maintenance', 'other']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  paidTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  dueDate: {
    type: Date,
    required: false
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'other'],
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field
paymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for faster queries
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ type: 1, createdAt: -1 });
paymentSchema.index({ paidBy: 1, status: 1 });
paymentSchema.index({ paidTo: 1, status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 