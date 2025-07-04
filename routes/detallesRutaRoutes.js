// routes/detallesRutaRoutes.js
const express = require('express');
const router = express.Router();
const detallesController = require('../controller/detallesRutaController');

// Obtener todos los detalles de una ruta
router.get('/:rutaId', detallesController.getDetallesByRuta);

// Crear un nuevo detalle para una ruta
router.post('/:rutaId', detallesController.createDetalle);

// Actualizar un detalle de una ruta
router.put('/:rutaId/:detalleId', detallesController.updateDetalle);

// Eliminar un detalle de una ruta
router.delete('/:rutaId/:detalleId', detallesController.deleteDetalle);

module.exports = router;
