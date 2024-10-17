const mongoose = require('mongoose');
const User = require('./userModel')
const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'amount is required']
    },
    transactionType: {
        type: String,
        required: [true, 'type of transaction is required']
    },
    category: {
        type: String,
        required: [true, 'category is required']
    },
    reference: {
        type: String,
    },
    description: {
        type: String,
        required: [true, "desc is required"]
    },
    date: {
        type: String,
        required: [true, 'date is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, // Reference to the User model
        required: true
    }
}, { timestamps: true });

const transactionModel = mongoose.model('transactions', transactionSchema);
module.exports = transactionModel;
