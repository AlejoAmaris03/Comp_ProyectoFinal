const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/conductores.json');

// Función para crear un nuevo objeto conductor
function crearConductor(id, nombres, apellidos, numeroLicencia, telefono, correo) {
    return {
        id,
        nombres,
        apellidos,
        numeroLicencia,
        telefono,
        correo,
        fechaCreacion: new Date().toISOString()
    };
}

// Función para obtener todos los conductores
function getConductores() {
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf-8');
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error al leer el archivo de conductores:", error);
      return [];
    }
  }

// Función para guardar los conductores en el archivo JSON
function saveConductores(conductores) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(conductores, null, 2), 'utf-8');
        console.log("Datos de conductores guardados correctamente");
        return true;
    } catch (error) {
        console.error("Error al guardar los datos de conductores:", error);
        return false;
    }
}

module.exports = {
    crearConductor,
    getConductores,
    saveConductores
};
