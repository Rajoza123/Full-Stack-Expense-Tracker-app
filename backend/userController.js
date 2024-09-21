const userModel = require('./userModel.js')

const loginController = async(req,res) =>{
    try{
       const {email,password} = req.body

       const user = await userModel.findOne({email,password})
       if(!user){
       return res.status(404).send('user not found')
       }
       res.status(200).json(user)
    }
    catch(error){
        res.status(400).json({
            success:false,
            error
        })
    }
}

const registerController = async(req,res)=>{
    try {
        const newUser = new userModel(req.body)
        await newUser.save()
    } catch (error) {
        res.status(400).json({
            success:false,
            error
        })
    }
}

module.exports ={loginController,registerController}