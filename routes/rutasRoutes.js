const express = require('express');
const router = express.Router();
const rutasController = require('../controller/rutasController');

// Buscar rutas (por conductor, vehículo, fecha)
router.get('/search', rutasController.searchRutas);

// Obtener todas las rutas
router.get('/', rutasController.getAllRutas);

// Obtener ruta por ID
router.get('/:id', rutasController.getRutaById);

// Crear nueva ruta
router.post('/', rutasController.createRuta);

// Actualizar ruta
router.put('/:id', rutasController.updateRuta);

// Eliminar ruta
router.delete('/:id', rutasController.deleteRuta);

module.exports = router;
