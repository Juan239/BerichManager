import { Router } from "express";
import multer from 'multer';
import { uploadAndReadExcel } from '../controllers/bitacoras/uploads.controller.js';

const router = Router();

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Definición de la ruta para subir el archivo Excel
router.post('/upload', upload.single('file'), uploadAndReadExcel);

export default router;
