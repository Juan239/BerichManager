import { Router } from "express";
import { verificarUsuario } from "../controllers/usuarios/sesion.controller.js";

const router = Router();

router.post("/sesion", verificarUsuario )

export default router