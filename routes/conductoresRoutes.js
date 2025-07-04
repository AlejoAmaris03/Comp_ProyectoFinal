const express = require('express');
const router = express.Router();
const conductoresController = require('../controller/conductoresController');

// Agrega la ruta de búsqueda antes de la ruta con parámetro
router.get('/search', conductoresController.searchConductores);

router.get('/', conductoresController.getAllConductores);
router.get('/:id', conductoresController.getConductorById);
router.post('/', conductoresController.createConductor);
router.put('/:id', conductoresController.updateConductor);
router.delete('/:id', conductoresController.deleteConductor);

module.exports = router;
