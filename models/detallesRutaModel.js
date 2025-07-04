// models/detallesRutaModel.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/detallesRuta.json');

// Función para obtener todos los detalles
function getDetalles() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf-8');
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer los detalles de ruta:", error);
    return [];
  }
}

// Función para guardar los detalles
function saveDetalles(detalles) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(detalles, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error al guardar los detalles de ruta:", error);
    return false;
  }
}

module.exports = {
  getDetalles,
  saveDetalles
};
