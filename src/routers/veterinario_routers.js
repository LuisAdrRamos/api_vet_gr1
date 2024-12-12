import { Router } from "express";
import { actualizarPassword, actualizarPerfil, confirmEmail, login, newPassword, perfilUser, recuperarPassword, registro, tokenPassRecover } from "../controllers/veterinario_controller.js";
import { verificarAutentificacion } from "../helpers/crearJWT.js";
const router = Router()

router.post('/registro', registro)
router.get('/confirmar/:token', confirmEmail)
router.post('/login', login)
router.post('/recuperar-password', recuperarPassword)
router.post('/recuperar-password/:token', tokenPassRecover)
router.post('/nueva-password/:token', newPassword)

router.get('/perfil', verificarAutentificacion, perfilUser)
router.patch('/actualizar-perfil', verificarAutentificacion, actualizarPerfil)
router.patch('/actualizar-password', verificarAutentificacion, actualizarPassword)

export default router