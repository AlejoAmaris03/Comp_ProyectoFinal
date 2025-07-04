const vehiculosModel = require('../models/vehiculosModel');

// Obtener todos los vehículos
function getAllVehiculos(req, res) {
    try {
        const vehiculos = vehiculosModel.getVehiculos();
        res.json({ success: true, data: vehiculos });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener los vehículos" });
    }
}

// Obtener vehículo por placa
function getVehiculoByPlaca(req, res) {
    try {
        const vehiculos = vehiculosModel.getVehiculos();
        const vehiculo = vehiculos.find(v => v.placa === req.params.placa);

        if (!vehiculo) {
            return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
        }
        res.json({ success: true, data: vehiculo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener el vehículo" });
    }
}

// Crear nuevo vehículo
function createVehiculo(req, res) {
    try {
        const { placa, modelo, color, marca, capacidadCarga } = req.body;

        // Validar datos requeridos
        if (!placa || !modelo || !marca) {
            return res.status(400).json({ 
                success: false, 
                message: "Placa, modelo y marca son requeridos" 
            });
        }

        // Verificar si ya existe un vehículo con esa placa
        const vehiculos = vehiculosModel.getVehiculos();
        const existe = vehiculos.some(v => v.placa === placa);
        
        if (existe) {
            return res.status(400).json({ 
                success: false, 
                message: "Ya existe un vehículo con esa placa" 
            });
        }

        // Crear nuevo vehículo
        const newVehiculo = vehiculosModel.crearVehiculo(
            placa,
            modelo,
            color,
            marca,
            capacidadCarga
        );

        vehiculos.push(newVehiculo);
        
        if (vehiculosModel.saveVehiculos(vehiculos)) {
            res.status(201).json({ 
                success: true, 
                message: "Vehículo creado exitosamente",
                data: newVehiculo 
            });
        } else {
            throw new Error("Error al guardar el vehículo");
        }
    } catch (error) {
        console.error("Error al crear el vehículo:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al crear el vehículo",
            error: error.message 
        });
    }
}

// Actualizar vehículo
function updateVehiculo(req, res) {
    try {
        const { placa } = req.params;
        const updateData = req.body;
        const vehiculos = vehiculosModel.getVehiculos();
        const vehiculoExiste = vehiculos.find(v => (v.placa !== placa && v.placa === updateData.placa));

        if(vehiculoExiste) {
            return res.status(400).json({ 
                success: false, 
                message: "Ya existe un vehículo con esa placa" 
            });
        };

        const index = vehiculos.findIndex(v => v.placa === placa);

        if (index === -1) {
            return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
        }

        // Actualizar solo los campos proporcionados
        vehiculos[index] = {
            ...vehiculos[index],
            ...updateData
        };

        if (vehiculosModel.saveVehiculos(vehiculos)) {
            res.json({ success: true, data: vehiculos[index] });
        } else {
            throw new Error("Error al guardar los cambios");
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar el vehículo" });
    }
}

// Eliminar vehículo
function deleteVehiculo(req, res) {
    try {
        const { placa } = req.params;
        const vehiculos = vehiculosModel.getVehiculos();
        const newVehiculos = vehiculos.filter(v => v.placa !== placa);

        if (newVehiculos.length === vehiculos.length) {
            return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
        }

        if (vehiculosModel.saveVehiculos(newVehiculos)) {
            res.json({ success: true, message: 'Vehículo eliminado correctamente' });
        } else {
            throw new Error("Error al eliminar el vehículo");
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar el vehículo" });
    }
}

function searchVehiculo(req, res) {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: "No se proporcionó el término de búsqueda" });
        }

        const vehiculos = vehiculosModel.getVehiculos();
        const lowerQuery = query.toLowerCase();

        // Filtrar vehículos que contengan el término en la placa, marca o modelo (sin distinguir mayúsculas)
        const filtered = vehiculos.filter(vehiculo =>
            vehiculo.placa.toLowerCase().includes(lowerQuery) ||
            vehiculo.marca.toLowerCase().includes(lowerQuery) ||
            vehiculo.modelo.toLowerCase().includes(lowerQuery)
        );

        if (filtered.length > 0) {
            res.json({ success: true, data: filtered });
        } else {
            res.json({ success: false, message: "No se encontraron vehículos" });
        }
    } catch (error) {
        console.error("Error al buscar vehículos:", error);
        res.status(500).json({ success: false, message: "Error al buscar vehículos", error: error.message });
    }
}

module.exports = {
    getAllVehiculos,
    getVehiculoByPlaca,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    searchVehiculo
};