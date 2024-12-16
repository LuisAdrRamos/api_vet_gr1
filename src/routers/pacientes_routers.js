import { Router } from "express";
import { actualizarPaciente, detallePaciente, listarPacientes, registrarPaciente, loginPaciente, perfilPaciente, eliminarPaciente } from "../controllers/paciente_Controller.js";
import { verificarAutentificacion } from "../helpers/crearJWT.js";

const router = Router()

router.post('/paciente/register', verificarAutentificacion, registrarPaciente)
router.get('/pacientes', verificarAutentificacion, listarPacientes)
router.get('/paciente/:id', verificarAutentificacion, detallePaciente)
router.put('/paciente/actualizar/:id', verificarAutentificacion, actualizarPaciente)
router.delete('/paciente/delete/:id', verificarAutentificacion, eliminarPaciente)

router.post('/paciente/login', loginPaciente)
router.get('/paciente/perfil', verificarAutentificacion, perfilPaciente)

export default router