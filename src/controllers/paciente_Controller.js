import Paciente from "../models/pacientes.js"
import veterinario from "../models/veterinario.js";
import { sendMailToPaciente } from "../config/nodemailer.js";

const registrarPaciente = async (req, res) => {
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const verificarEmailBDD = await Paciente.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    
    const nuevoPaciente = new Paciente(req.body)
    const password = Math.random().toString(36).slice(2)
    
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("vet"+password)
    await sendMailToPaciente(email,"vet"+password)
    nuevoPaciente.veterinario=req.veterinarioBDD._id
    await nuevoPaciente.save()
    
    res.status(200).json({msg:"Registro exitoso del paciente y correo enviado"})
}

const listarPacientes = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}

const detallePaciente = (req, res) => {
    res.send("detalles del Paciete")
}

const actualizarPaciente = (req, res) => {
    res.send("Paciete actualizado")
}

const eliminarPaciente = (req, res) => {
    res.send("Paciete eliminado")
}

const loginPaciente = (req, res) => {
    res.send("Paciete logeado")
}

const perfilPaciente = (req, res) => {
    res.send("Perfil del Paciete")
}


export {
    registrarPaciente,
    listarPacientes,
    detallePaciente,
    actualizarPaciente,
    eliminarPaciente,
    loginPaciente,
    perfilPaciente
}