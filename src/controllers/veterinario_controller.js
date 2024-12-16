import Veterinario from "../models/veterinario.js"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import veterinario from "../models/veterinario.js"
import {generarJWT} from "../helpers/crearJWT.js"

const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Veterinario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)

    const token = nuevoVeterinario.crearToken()
    await spsndMailToUser(email,token)
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
    
    const {nombre, apellido, telefono, direccion} = veterinarioBDD
    const tokenJWT = generarJWT(veterinarioBDD._id, "veterinario"); 
    res.status(200).json({
        tokenJWT,
        nombre,
        apellido,
        telefono,
        direccion
    });
}

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
        const veterinarioBDD = await Veterinario.findOne({email})
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    
    const token = veterinarioBDD.crearToken()
    veterinarioBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}

const tokenPassRecover = async(req,res) => {
    const {token} = req.params
    if (!(token)) return res.status(400).json({msg:"Lo sentimos no se puede validar su cuenta"})
    
    const veterinarioBDD = await Veterinario.findOne({token})
    if(veterinarioBDD?.token !== token) res.status(400).json({msg:"Lo sentimos, no se puede validar su token"})
    
    await veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

const newPassword = async(req,res) => {
    const {password, confirmPassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    if (password != confirmPassword) return res.status(404).json({msg:"Las contraseñas no coinciden"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    veterinarioBDD.token = null
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Contraseña cambiada exitosamente"})
}

const perfilUser = (req, res) => {
    delete req.veterinarioBDD.token
    delete req.veterinarioBDD.confirmEmail
    delete req.veterinarioBDD.createdAt
    delete req.veterinarioBDD.updatedAt
    delete req.veterinarioBDD.__v
    res.status(200).json(req.veterinarioBDD)
}

const actualizarPerfil = async (req,res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const veterinarioBDD = await Veterinario.findById(id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    if (veterinarioBDD.email !=  req.body.email)
    {
        const veterinarioBDDMail = await Veterinario.findOne({email:req.body.email})
        if (veterinarioBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
		veterinarioBDD.nombre = req.body.nombre || veterinarioBDD?.nombre
    veterinarioBDD.apellido = req.body.apellido  || veterinarioBDD?.apellido
    veterinarioBDD.direccion = req.body.direccion ||  veterinarioBDD?.direccion
    veterinarioBDD.telefono = req.body.telefono || veterinarioBDD?.telefono
    veterinarioBDD.email = req.body.email || veterinarioBDD?.email
    await veterinarioBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}

const actualizarPassword = async (req, res) => {
    const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const verificarPassword = await veterinarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(req.body.passwordnuevo)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

export {
    registro,
    confirmEmail,
    login,
    recuperarPassword,
    tokenPassRecover,
    newPassword,
    perfilUser,
    actualizarPerfil,
    actualizarPassword
}