const express = require('express')
const { addTransaction, getAllTransactions, deleteTransaction, modifyTransaction } = require('./transactionCtrl')
const authMiddleware = require('./authMiddleware')

const router = express.Router()


router.post('/add-transaction', authMiddleware, addTransaction)

router.get('/get-transaction', authMiddleware, getAllTransactions)

router.delete('/delete-transaction/:id', authMiddleware, deleteTransaction);
// New delete route
router.put('/modify-transaction/:id', authMiddleware, modifyTransaction); // New delete route


module.exports = router