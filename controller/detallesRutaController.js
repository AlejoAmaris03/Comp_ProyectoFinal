// controller/detallesRutaController.js
const detallesModel = require('../models/detallesRutaModel');

// Obtener todos los detalles de una ruta (filtrando por rutaId)
function getDetallesByRuta(req, res) {
  try {
    const rutaId = req.params.rutaId;
    const detalles = detallesModel.getDetalles();
    const detallesRuta = detalles.filter(d => String(d.rutaId) === String(rutaId));
    res.json({ success: true, data: detallesRuta });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener los detalles de ruta", error: error.message });
  }
}

// Crear un nuevo detalle para una ruta
function createDetalle(req, res) {
  try {
    const rutaId = req.params.rutaId;
    const { latitud, longitud, direccion, numeroPaquete } = req.body;
    if (!latitud || !longitud || !direccion || !numeroPaquete) {
      return res.status(400).json({ success: false, message: "Datos incompletos para el detalle" });
    }
    const detalles = detallesModel.getDetalles();
    const newId = detalles.length > 0 ? Math.max(...detalles.map(d => parseInt(d.id))) + 1 : 1;
    const newDetalle = {
      id: newId,
      rutaId,
      latitud,
      longitud,
      direccion,
      numeroPaquete,
      fechaCreacion: new Date().toISOString()
    };
    detalles.push(newDetalle);
    if (detallesModel.saveDetalles(detalles)) {
      res.status(201).json({ success: true, data: newDetalle });
    } else {
      throw new Error("Error al guardar el detalle");
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear el detalle", error: error.message });
  }
}

// Actualizar un detalle de ruta
function updateDetalle(req, res) {
  try {
    const { rutaId, detalleId } = req.params;
    const updateData = req.body;
    const detalles = detallesModel.getDetalles();
    const index = detalles.findIndex(d => String(d.id) === String(detalleId) && String(d.rutaId) === String(rutaId));
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Detalle no encontrado" });
    }
    detalles[index] = { ...detalles[index], ...updateData };
    if (detallesModel.saveDetalles(detalles)) {
      res.json({ success: true, data: detalles[index] });
    } else {
      throw new Error("Error al guardar el detalle actualizado");
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar el detalle", error: error.message });
  }
}

// Eliminar un detalle de ruta
function deleteDetalle(req, res) {
  try {
    const { rutaId, detalleId } = req.params;
    let detalles = detallesModel.getDetalles();
    const initialLength = detalles.length;
    detalles = detalles.filter(d => !(String(d.id) === String(detalleId) && String(d.rutaId) === String(rutaId)));
    if (detalles.length === initialLength) {
      return res.status(404).json({ success: false, message: "Detalle no encontrado" });
    }
    if (detallesModel.saveDetalles(detalles)) {
      res.json({ success: true, message: "Detalle eliminado correctamente" });
    } else {
      throw new Error("Error al guardar los cambios");
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar el detalle", error: error.message });
  }
}

module.exports = {
  getDetallesByRuta,
  createDetalle,
  updateDetalle,
  deleteDetalle
};
