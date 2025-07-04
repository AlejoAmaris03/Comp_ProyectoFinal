const conductoresModel = require('../models/conductoresModel');
const { getConductores } = require('../models/conductoresModel');

// Obtener todos los conductores
function getAllConductores(req, res) {
    try {
        const conductores = conductoresModel.getConductores();
        res.json({ success: true, data: conductores });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener los conductores" });
    }
}

// Obtener conductor por ID
function getConductorById(req, res) {
    try {
        const conductores = conductoresModel.getConductores();
        console.log("ID recibido:", req.params.id);
        // Comparamos como strings (o convertimos ambos a string)
        const conductor = conductores.find(c => String(c.id) === String(req.params.id));
        if (!conductor) {
            console.log("No se encontró conductor con ID:", req.params.id);
            return res.status(404).json({ success: false, message: 'Conductor no encontrado' });
        }
        res.json({ success: true, data: conductor });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener el conductor" });
    }
}

// Crear nuevo conductor
function createConductor(req, res) {
    try {
        const { id, nombres, apellidos, numeroLicencia, telefono, correo } = req.body;
        // Validar campos requeridos
        if (!id || !nombres || !apellidos) {
            return res.status(400).json({ success: false, message: "Datos del conductor inválidos o incompletos" });
        }
        
        const conductores = conductoresModel.getConductores();
        // Verificar si ya existe un conductor con ese ID (comparación como string)
        const existe = conductores.some(c => String(c.id) === String(id));
        if (existe) {
            return res.status(400).json({ success: false, message: "Ya existe un conductor con ese ID" });
        }
        
        // Crear nuevo conductor usando el método del modelo
        const newConductor = conductoresModel.crearConductor(
            id,
            nombres,
            apellidos,
            numeroLicencia,
            telefono,
            correo
        );
        
        conductores.push(newConductor);
        if (conductoresModel.saveConductores(conductores)) {
            res.status(201).json({ success: true, message: "Conductor creado exitosamente", data: newConductor });
        } else {
            throw new Error("Error al guardar el conductor");
        }
    } catch (error) {
        console.error("Error al crear el conductor:", error);
        res.status(500).json({ success: false, message: "Error al crear el conductor", error: error.message });
    }
}

// Actualizar conductor
function updateConductor(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const conductores = conductoresModel.getConductores();
        const conductorExiste = conductores.find(c => (String(c.id) !== String(id) && String(c.id) === String(updateData.id)));
        
        if(conductorExiste)
            return res.status(400).json({ success: false, message: "Ya existe un conductor con ese ID" });
        
        // Comparar los IDs como string
        const conductorIndex = conductores.findIndex(c => String(c.id) === String(id));
        if (conductorIndex === -1) {
            return res.status(404).json({ success: false, message: "Conductor no encontrado" });
        }
    
        const currentConductor = conductores[conductorIndex];
        
        conductores[conductorIndex] = {
            ...currentConductor,
            id: updateData.id ||currentConductor.id,
            nombres: updateData.nombres || currentConductor.nombres,
            apellidos: updateData.apellidos || currentConductor.apellidos,
            numeroLicencia: updateData.numeroLicencia || currentConductor.numeroLicencia,
            telefono: updateData.telefono || currentConductor.telefono,
            correo: updateData.correo || currentConductor.correo
        };
        
        if (conductoresModel.saveConductores(conductores)) {
            res.json({ success: true, data: conductores[conductorIndex] });
        } else {
            throw new Error("Error al guardar los cambios");
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar el conductor", error: error.message });
    }
}

// Eliminar conductor
function deleteConductor(req, res) {
    try {
        const conductores = conductoresModel.getConductores();
        // Comparar IDs como string
        const newConductores = conductores.filter(c => String(c.id) !== String(req.params.id));
        if (newConductores.length === conductores.length) {
            return res.status(404).json({ success: false, message: 'Conductor no encontrado' });
        }
        if (conductoresModel.saveConductores(newConductores)) {
            res.json({ success: true, message: 'Conductor eliminado correctamente' });
        } else {
            throw new Error("Error al eliminar el conductor");
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar el conductor", error: error.message });
    }
}

const searchConductores = (req, res) => {
  try {
    const searchTerm = req.query.names;
    if (!searchTerm) {
      return res.json({ success: false, message: "No se proporcionó término de búsqueda" });
    }
    
    const conductores = getConductores();
    // Verifica que el resultado sea un arreglo
    if (!Array.isArray(conductores)) {
      throw new Error("El formato de conductores no es válido");
    }

    const conductoresFiltrados = conductores.filter(conductor => {
      // Asegúrate de que los campos existen y son cadenas
      const nombres = conductor.nombres ? conductor.nombres.toString() : "";
      const apellidos = conductor.apellidos ? conductor.apellidos.toString() : "";
      return nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
             apellidos.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (conductoresFiltrados.length > 0) {
      return res.json({ success: true, data: conductoresFiltrados });
    } else {
      return res.json({ success: false, message: "Conductor no encontrado" });
    }
  } catch (error) {
    console.error("Error en searchConductores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
    getAllConductores,
    getConductorById,
    createConductor,
    updateConductor,
    deleteConductor,
    searchConductores
};
