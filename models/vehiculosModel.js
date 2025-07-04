const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/vehiculos.json');

// Función para crear un nuevo objeto vehículo
function crearVehiculo(placa, modelo, color, marca, capacidadCarga) {
    return {
        placa,
        modelo,
        color,
        marca,
        capacidadCarga,
        fechaCreacion: new Date().toISOString()
    };
}

// Función para obtener todos los vehículos
function getVehiculos() {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]', 'utf-8');
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer vehículos:", error);
        return [];
    }
}

// Función para guardar vehículos
function saveVehiculos(vehiculos) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(vehiculos, null, 2));
        return true;
    } catch (error) {
        console.error("Error al guardar vehículos:", error);
        return false;
    }
}

module.exports = {
    crearVehiculo,
    getVehiculos,
    saveVehiculos
};