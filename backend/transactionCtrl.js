const transactionModel = require('./transactionModel')
const jwt = require('jsonwebtoken');
const User = require('./userModel')
// const getAllTransactions = () =>{
//          try{
//             const transaction = transactionModel.find({})
//             res.status(200).json(transaction)
//          }
//          catch(error){
//             console.log(error)
//             res.status(500).json(error)
//         }
// }
const addTransaction = async (req, res) => {
    try {
        // Get token from the authorization header
        const token = req.headers.authorization.split(' ')[1]; // Assuming "Bearer token"

        // Decode the token to get user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure to use your JWT secret
        const userId = decoded.id; // Assuming you store user ID in the token

        // Create the new transaction with userId
        const newTransaction = new transactionModel({
            ...req.body,
            userId: userId, // Add the userId to the transaction
        });

        await newTransaction.save();
        res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        console.log('UserId in request:', req.userId); // Check if userId is present
        if (!req.userId) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }
        const transactions = await transactionModel.find({ userId: req.userId }).populate('userId', 'username');
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error in getAllTransactions:', error); // Log the error for more info
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params; // Get the transaction ID from the request parameters
        await transactionModel.findByIdAndDelete(id); // Delete the transaction
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
};

const modifyTransaction = async (req, res) => {
    const { id } = req.params;
    const { amount, transactionType, category, reference, description, date } = req.body;

    try {
        // Validate incoming data if necessary
        if (!amount || !transactionType || !category || !date) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Find the transaction by ID and update it
        const updatedTransaction = await transactionModel.findByIdAndUpdate(
            id,
            { amount, transactionType, category, reference, description, date },
            { new: true, runValidators: true } // Return the updated document and validate
        );

        // If no transaction found
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Send the updated transaction back
        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Error updating transaction' });
    }
};




module.exports = { getAllTransactions, addTransaction, deleteTransaction, modifyTransaction }