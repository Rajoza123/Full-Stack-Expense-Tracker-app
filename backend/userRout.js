const express = require('express')
const { loginController, registerController } = require('./userController')
const authMiddleware = require('./authMiddleware')

const router = express.Router()

router.post('/login',loginController)

router.post('/register',registerController)

module.exports=router