import Veterinario from "../models/veterinario.js"
import sendMailToUser from "../config/nodemailer.js"
import veterinario from "../models/veterinario.js"

const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Veterinario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)

    const token = nuevoVeterinario.crearToken()
    await sendMailToUser(email,token)
    await nuevoVeterinario.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

const confirmEmail = async (req, res) => {
    const {token} = req.params
    if (!(token)) return res.status(400).json({msg:"Lo sentimos o se puede validar su cuenta"})
    
    const veterinarioBDD = await Veterinario.findOne({token})
    if(!(veterinarioBDD?.token)) return res.status(400).json({msg:"La centa ya ha sido confirmada"})
    
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail = true
    await veterinarioBDD.save()

    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesion"})
}

const login = async (req, res) => {
    const {email, password} = req.body
    
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const veterinarioBDD = await Veterinario.findOne({email})
    if (veterinarioBDD?.confirmEmail===false) return res.status(400).json({msg:"Los sentimos debe verificar la cuenta"})
    
    if (!veterinarioBDD) return res.status(400).json({msg:"Lo sentimos, email incorrecto"})    
    const verificarPass = await veterinarioBDD.matchPassword(password)
    if (!verificarPass) return res.status(400).json({msg:"Lo sentimos, contraseña incorrecta"})
    
    res.status(200).json(veterinarioBDD)
}



export {
    registro,
    confirmEmail,
    login
}