// Función para mostrar alertas
function showAlert(message, type = 'success') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: type,
        title: message
    })
}

// Función para validar el formulario de vehículo
function validateForm(formData) {
    const placa = formData.get('placa');
    const marca = formData.get('marca');
    const modelo = formData.get('modelo');
    const color = formData.get('color');
    // La capacidad de carga es opcional en este ejemplo.
    if (!placa || placa.trim() === '') return false;
    if (!marca || marca.trim() === '') return false;
    if (!modelo || modelo.trim() === '') return false;
    if (!color || color.trim() === '') return false;
    return true;
}

// Función para obtener y mostrar todos los vehículos
function fetchVehiculos() {
    fetch('/api/vehiculos')
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(result => {
            if (result.success) {
                renderVehiculos(result.data);
            } else {
                throw new Error('Error en la respuesta de la API');
            }
        })
        .catch(error => showAlert('Error al cargar los vehículos: ' + error.message, 'error'));
}

// Función para renderizar las tarjetas de vehículos
function renderVehiculos(vehiculos) {
    const container = document.getElementById('vehiculosContainer');
    container.innerHTML = '';
    vehiculos.forEach(vehiculo => {
        const card = `
                    <div class="col-md-6 col-lg-4">
                        <div class="card vehiculo-card h-100">
                            <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <div class="vehiculo-icon me-3">
                                <i class="fas fa-truck fa-lg"></i>
                                </div>
                                <div>
                                <h5 class="card-title mb-0">${vehiculo.marca} ${vehiculo.modelo}</h5>
                                <small class="text-muted"><i class="fas fa-id-card me-1"></i> ${vehiculo.placa}</small>
                                </div>
                            </div>
                            <ul class="list-unstyled mb-4">
                                <li><i class="fas fa-palette me-2"></i><strong>Color:</strong> ${vehiculo.color}</li>
                                <li><i class="fas fa-weight-hanging me-2"></i><strong>Carga:</strong> ${vehiculo.capacidadCarga || 'N/D'}</li>
                            </ul>
                            <div class="d-flex justify-content-between gap-2">
                                <button class="btn btn-sm btn-outline-info w-100" onclick="showVehiculoDetails('${vehiculo.placa}')">
                                <i class="fas fa-info-circle"></i> Detalles
                                </button>
                                <button class="btn btn-sm btn-outline-warning w-100" onclick="editVehiculo('${vehiculo.placa}')">
                                <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn-sm btn-outline-danger w-100" onclick="deleteVehiculo('${vehiculo.placa}')">
                                <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>`;
        container.innerHTML += card;
    });
}

// Envío del formulario: crear o actualizar vehículo
document.getElementById('vehiculoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    form.classList.add('was-validated');

    const formData = new FormData(form);
    if (!validateForm(formData)) return;

    const vehiculoData = {
        placaOriginal: formData.get('placaOriginal'),
        placa: formData.get('placa'),
        marca: formData.get('marca'),
        modelo: formData.get('modelo'),
        color: formData.get('color'),
        capacidadCarga: formData.get('capacidadCarga')
    };

    // Determinar si se está editando o creando
    const isEditing = form.getAttribute('data-editing') === 'true';
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/vehiculos/${vehiculoData.placaOriginal}` : '/api/vehiculos';
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehiculoData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            if (!data.success) {
                showAlert(data.message, 'error');
                return;
            }
            showAlert(isEditing ? 'Vehículo actualizado correctamente' : 'Vehículo creado exitosamente', 'success');
            fetchVehiculos();
            const modal = bootstrap.Modal.getInstance(document.getElementById('vehiculoModal'));
            modal.hide();
            form.reset();
            form.classList.remove('was-validated');
            form.removeAttribute('data-editing');
            document.getElementById('modalTitle').textContent = 'Agregar Nuevo Vehículo';
        })
        .catch(error => showAlert(error.message || 'Error al procesar la solicitud', 'error'));
});

// Función para editar: carga datos en el formulario y activa modo edición
function editVehiculo(placa) {
    fetch(`/api/vehiculos/${placa}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const vehiculo = result.data;
                document.querySelector('[name="placaOriginal"]').value = vehiculo.placa;
                document.querySelector('[name="placa"]').value = vehiculo.placa;
                document.querySelector('[name="marca"]').value = vehiculo.marca;
                document.querySelector('[name="modelo"]').value = vehiculo.modelo;
                document.querySelector('[name="color"]').value = vehiculo.color;
                document.querySelector('[name="capacidadCarga"]').value = vehiculo.capacidadCarga;
                document.getElementById('modalTitle').textContent = 'Editar Vehículo';
                document.getElementById('vehiculoForm').setAttribute('data-editing', 'true');
                new bootstrap.Modal(document.getElementById('vehiculoModal')).show();
            } else {
                showAlert(result.message, 'danger');
            }
        })
        .catch(error => showAlert('Error al cargar el vehículo: ' + error.message, 'error'));
}

// Función para eliminar vehículo
function deleteVehiculo(placa) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/vehiculos/${placa}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        showAlert('Vehículo eliminado correctamente', 'success');
                        fetchVehiculos();
                    } else {
                        showAlert('Error al eliminar el vehículo', 'error');
                    }
                })
                .catch(error => showAlert('Error al eliminar el vehículo', 'error'));
        }
    })
}

// Función para mostrar detalles del vehículo
function showVehiculoDetails(placa) {
    fetch(`/api/vehiculos/${placa}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const vehiculo = result.data;
                const detailsBody = document.getElementById('vehiculoDetailsBody');
                detailsBody.innerHTML = `
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="vehiculo-details p-4 rounded-4 shadow-sm bg-white">
                                    <h4 class="fw-bold mb-4">
                                        <i class="fas fa-truck me-2"></i>${vehiculo.marca} ${vehiculo.modelo}
                                    </h4>
                                    <ul class="list-unstyled fs-6">
                                        <li class="mb-2">
                                        <i class="fas fa-id-card me-2"></i>
                                        <strong>Placa:</strong> ${vehiculo.placa}
                                        </li>
                                        <li class="mb-2">
                                        <i class="fas fa-palette me-2"></i>
                                        <strong>Color:</strong> ${vehiculo.color}
                                        </li>
                                        <li class="mb-2">
                                        <i class="fas fa-weight-hanging me-2"></i>
                                        <strong>Capacidad de Carga:</strong> ${vehiculo.capacidadCarga || 'N/D'}
                                        </li>
                                    </ul>
                                    </div>
                                </div>
                            </div>`;
                new bootstrap.Modal(document.getElementById('detailsModal')).show();
            } else {
                showAlert(result.message, 'danger');
            }
        })
        .catch(error => showAlert('Error al cargar los detalles del vehículo: ' + error.message, 'error'));
}

// Buscador unificado: filtra por placa, marca o modelo
document.getElementById('searchInput').addEventListener('input', function (e) {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length === 0) {
        fetchVehiculos();
        return;
    }
    // Se asume que en el backend existe un endpoint de búsqueda que acepte el parámetro "query"
    fetch(`/api/vehiculos/search?query=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                renderVehiculos(result.data);
            } else {
                showAlert(result.message, 'danger');
                document.getElementById('vehiculosContainer').innerHTML = '';
            }
        })
        .catch(error => showAlert('Error en la búsqueda: ' + error.message, 'error'));
});

// Al cerrar el modal, limpiar el formulario y resetear modo edición
document.getElementById('vehiculoModal').addEventListener('hidden.bs.modal', function () {
    const form = document.getElementById('vehiculoForm');
    form.reset();
    form.classList.remove('was-validated');
    form.removeAttribute('data-editing');
    document.getElementById('modalTitle').textContent = 'Agregar Nuevo Vehículo';
});

// Cargar todos los vehículos al inicio
fetchVehiculos();