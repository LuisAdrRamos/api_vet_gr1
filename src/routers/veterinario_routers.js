import { Router } from "express";
import { actualizarPassword, actualizarPerfil, confirmEmail, login, newPassword, perfilUser, recuperarPassword, registro, tokenPassRecover } from "../controllers/veterinario_controller.js";
import { verificarAutentificacion } from "../helpers/crearJWT.js";
const router = Router()

router.post('/registro/veterinario', registro)
router.get('/confirmar/:token', confirmEmail)
router.post('/login/veterinario', login)
router.post('/recuperar-password', recuperarPassword)
router.post('/recuperar-password/:token', tokenPassRecover)
router.post('/nueva-password/:token', newPassword)

router.get('/perfil/veterinario', verificarAutentificacion, perfilUser)
router.put('/actualizar-perfil/veterinario', verificarAutentificacion, actualizarPerfil)
router.put('/actualizar-password/veteriario', verificarAutentificacion, actualizarPassword)

export default router