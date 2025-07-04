const express = require('express');
const router = express.Router();
const {
    getAllVehiculos,
    getVehiculoByPlaca,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    searchVehiculo  // Importa la función de búsqueda
} = require('../controller/vehiculosController');

// Agrega el endpoint de búsqueda antes de la ruta dinámica
router.get('/search', searchVehiculo);

// Rutas para vehículos
router.get('/', getAllVehiculos);
router.get('/:placa', getVehiculoByPlaca);
router.post('/', createVehiculo);
router.put('/:placa', updateVehiculo);
router.delete('/:placa', deleteVehiculo);

module.exports = router;
