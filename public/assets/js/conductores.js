function createCard(conductor) {
    return `
                <div class="col-md-6 col-lg-4">
                    <div class="conductor-card h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <div class="conductor-avatar me-3">
                                    <i class="fas fa-id-badge fa-lg"></i>
                                </div>
                                <div>
                                    <h5 class="card-title mb-0">${conductor.nombres} ${conductor.apellidos}</h5>
                                    <small class="text-muted"><i class="fas fa-id-card me-1"></i> ${conductor.id}</small>
                                </div>
                            </div>
                            <ul class="list-unstyled mb-4">
                                <li><i class="fas fa-clipboard-check me-2"></i><strong>Licencia:</strong> ${conductor.numeroLicencia}</li>
                                <li><i class="fas fa-phone me-2"></i><strong>Teléfono:</strong> ${conductor.telefono}</li>
                                <li><i class="fas fa-envelope me-2"></i><strong>Correo:</strong> ${conductor.correo}</li>
                            </ul>
                            <div class="d-flex justify-content-between gap-2">
                                <button class="btn btn-sm btn-outline-info w-100" onclick="showConductorDetails('${conductor.id}')"><i class="fas fa-info-circle"></i> Detalles</button>
                                <button class="btn btn-sm btn-outline-warning w-100" onclick="editConductor('${conductor.id}')"><i class="fas fa-edit"></i> Editar</button>
                                <button class="btn btn-sm btn-outline-danger w-100" onclick="deleteConductor('${conductor.id}')"><i class="fas fa-trash"></i> Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
}

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

function validateForm(formData) {
    const id = formData.get('id');
    const nombres = formData.get('nombres');
    const apellidos = formData.get('apellidos');
    const numeroLicencia = formData.get('numeroLicencia');
    const telefono = formData.get('telefono');
    const correo = formData.get('correo');

    if (!id || id.trim() === '') return false;
    if (!nombres || nombres.trim() === '') return false;
    if (!apellidos || apellidos.trim() === '') return false;
    if (!numeroLicencia || numeroLicencia.trim() === '') return false;
    if (!telefono || telefono.trim() === '') return false;
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return false;
    return true;
}

// Función para obtener y mostrar todos los conductores
function fetchConductores() {
    fetch('/api/conductores')
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(result => {
            if (result.success) {
                renderConductores(result.data);
            } else {
                throw new Error('Error en la respuesta de la API');
            }
        })
        .catch(error => showAlert('Error al cargar los conductores: ' + error.message, 'error'));
}

// Función para renderizar las tarjetas de conductor
function renderConductores(conductores) {
    const container = document.getElementById('conductoresContainer');
    container.innerHTML = '';
    conductores.forEach(conductor => {
        const card = createCard(conductor);
        container.innerHTML += card;
    });
}

// Envío del formulario: crear o actualizar conductor
document.getElementById('conductorForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    form.classList.add('was-validated');

    const formData = new FormData(form);
    if (!validateForm(formData)) return;

    // Se crea el objeto conductor usando el valor del input con name="id"
    const conductorData = {
        idOriginal: formData.get('idOriginal'),
        id: formData.get('id'),
        nombres: formData.get('nombres'),
        apellidos: formData.get('apellidos'),
        numeroLicencia: formData.get('numeroLicencia'),
        telefono: formData.get('telefono'),
        correo: formData.get('correo')
    };

    // Determinar si es edición o creación según si el formulario tiene el atributo data-editing
    const isEditing = form.getAttribute('data-editing') === 'true';
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/conductores/${conductorData.idOriginal}` : '/api/conductores';
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(conductorData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            if (!data.success) {
                showAlert(data.message, 'error');
                return;
            }
            showAlert(isEditing ? 'Conductor actualizado correctamente' : 'Conductor creado exitosamente', 'success');
            fetchConductores();
            const modal = bootstrap.Modal.getInstance(document.getElementById('conductorModal'));
            modal.hide();
            form.reset();
            form.classList.remove('was-validated');
            form.removeAttribute('data-editing');
            document.getElementById('modalTitle').textContent = 'Agregar Nuevo Conductor';
        })
        .catch(error => {
            showAlert(error.message || 'Error al procesar la solicitud', 'error');
        });
});

// Función para editar: carga los datos en el formulario y marca el modo edición
function editConductor(id) {
    fetch(`/api/conductores/${id}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const conductor = result.data;
                // Se llena el input visible (name="id")
                document.querySelector('[name="idOriginal"]').value = conductor.id;
                document.querySelector('[name="id"]').value = conductor.id;
                document.querySelector('[name="nombres"]').value = conductor.nombres;
                document.querySelector('[name="apellidos"]').value = conductor.apellidos;
                document.querySelector('[name="numeroLicencia"]').value = conductor.numeroLicencia;
                document.querySelector('[name="telefono"]').value = conductor.telefono;
                document.querySelector('[name="correo"]').value = conductor.correo;
                document.getElementById('modalTitle').textContent = 'Editar Conductor';
                // Se marca el formulario en modo edición
                document.getElementById('conductorForm').setAttribute('data-editing', 'true');
                new bootstrap.Modal(document.getElementById('conductorModal')).show();
            } else {
                showAlert(result.message, 'danger');
            }
        })
        .catch(error => showAlert('Error al cargar el conductor: ' + error.message, 'error'));
}

// Función para eliminar conductor
function deleteConductor(id) {
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
            fetch(`/api/conductores/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        showAlert('Conductor eliminado correctamente', 'success');
                        fetchConductores();
                    } else {
                        showAlert('Error al eliminar el conductor', 'error');
                    }
                })
                .catch(error => showAlert('Error al eliminar el conductor', 'error'));
        }
    })
}

// Función para mostrar detalles del conductor
function showConductorDetails(id) {
    fetch(`/api/conductores/${id}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const conductor = result.data;
                const detailsBody = document.getElementById('conductorDetailsBody');
                detailsBody.innerHTML = `
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="conductor-details shadow-sm bg-white">
                                        <h4 class="fw-bold mb-4">
                                            <i class="fas fa-user me-2"></i>${conductor.nombres} ${conductor.apellidos}
                                        </h4>
                                        <ul class="list-unstyled fs-6">
                                            <li class="mb-2">
                                                <i class="fas fa-id-card me-2"></i>
                                                <strong>ID:</strong> ${conductor.id}
                                            </li>
                                            <li class="mb-2">
                                                <i class="fas fa-clipboard-check me-2"></i>
                                                <strong>Licencia:</strong> ${conductor.numeroLicencia}
                                            </li>
                                            <li class="mb-2">
                                                <i class="fas fa-phone me-2"></i>
                                                <strong>Teléfono:</strong> ${conductor.telefono}
                                            </li>
                                            <li class="mb-2">
                                                <i class="fas fa-envelope me-2"></i>
                                                <strong>Correo:</strong> ${conductor.correo}
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
        .catch(error => showAlert('Error al cargar los detalles del conductor: ' + error.message, 'error'));
}

// Buscador unificado: filtra por nombre, apellido o ID
document.getElementById('searchInput').addEventListener('input', function (e) {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length === 0) {
        fetchConductores();
        return;
    }
    // Si el término es numérico, primero intenta buscar por ID
    if (/^\d+$/.test(searchTerm)) {
        fetch(`/api/conductores/${searchTerm}`)
            .then(response => {
                // Si no se encuentra por ID (404), buscar por nombre/apellido
                if (response.status === 404) {
                    return fetch(`/api/conductores/search?names=${encodeURIComponent(searchTerm)}`)
                        .then(res => res.json());
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    let data = result.data;
                    if (!Array.isArray(data)) data = [data];
                    renderConductores(data);
                } else {
                    // Si no se encontró por ID, buscar por nombre/apellido
                    fetch(`/api/conductores/search?names=${encodeURIComponent(searchTerm)}`)
                        .then(response => response.json())
                        .then(result => {
                            if (result.success) {
                                renderConductores(result.data);
                            } else {
                                showAlert(result.message, 'danger');
                                document.getElementById('conductoresContainer').innerHTML = '';
                            }
                        })
                        .catch(error => showAlert('Error en la búsqueda: ' + error.message, 'error'));
                }
            })
            .catch(error => showAlert('Error en la búsqueda: ' + error.message, 'error'));
    } else {
        // Búsqueda por nombre o apellido
        fetch(`/api/conductores/search?names=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    renderConductores(result.data);
                } else {
                    showAlert(result.message, 'danger');
                    document.getElementById('conductoresContainer').innerHTML = '';
                }
            })
            .catch(error => showAlert('Error en la búsqueda: ' + error.message, 'error'));
    }
});

// Al cerrar el modal, limpiar el formulario y resetear el modo edición
document.getElementById('conductorModal').addEventListener('hidden.bs.modal', function () {
    const form = document.getElementById('conductorForm');
    form.reset();
    form.classList.remove('was-validated');
    form.removeAttribute('data-editing');
    document.getElementById('modalTitle').textContent = 'Agregar Nuevo Conductor';
});

// Cargar todos los conductores al inicio
fetchConductores();