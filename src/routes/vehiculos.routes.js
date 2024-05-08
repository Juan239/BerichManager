import {Router} from 'express';
import {obtenerVehiculos, crearVehiculo, eliminarVehiculo, obtenerVehiculoPorId, actualizarVehiculo} from '../controllers/bitacoras/vehiculos.controller.js';
import {validarToken} from '../middleware/verificarToken.middleware.js';

const router = Router();

router.get('/vehiculos', validarToken, obtenerVehiculos);

router.post('/vehiculos', validarToken, crearVehiculo);

router.delete('/vehiculos/:id', validarToken, eliminarVehiculo);

router.get('/vehiculos/:id', validarToken, obtenerVehiculoPorId);

router.put('/vehiculos/:id', validarToken, actualizarVehiculo);

export default router;
