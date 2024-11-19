
// Variables de referencia
const btnRegistrar = document.getElementById('btnRegistrar');
const btnConsultar = document.getElementById('btnConsultar');
const btnModificar = document.getElementById('btnModificar');
const btnGuardarAlimentacion = document.getElementById('btnGuardarAlimentacion');
const btnModificarAlimentacion = document.getElementById('btnModificarAlimentacion');

const alimentacionInputs = document.getElementById('alimentacionInputs');
const contenedorTablaAlimentacion = document.getElementById('contenedorTablaAlimentacion');
const modificarAlimentacionContainer = document.getElementById('modificarAlimentacionContainer');
const tablaAlimentacion = document.getElementById('tablaAlimentacion').querySelector('tbody');
const mensajeNoEncontradoAlimentacion = document.getElementById('mensajeNoEncontradoAlimentacion');

function mostrarSeccio(seccion) {
    switch (seccion) {
        case 'ganado':
            window.location.href = 'http://127.0.0.1:5000/ganadero/ganado';
            break;
        case 'vinculacion':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alimentaciongrupo';
            break;
        case 'alertas':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alertas';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000/login';
            break;
        default:
            window.location.href = 'http://127.0.0.1:5000/ganadero/alimentacion';
            break;
    }
}
// Función para mostrar u ocultar secciones
function mostrarSeccion(seccion) {
    alimentacionInputs.style.display = 'none';
    contenedorTablaAlimentacion.style.display = 'none';
    modificarAlimentacionContainer.style.display = 'none';

    if (seccion === 'registrar') {
        alimentacionInputs.style.display = 'block';
    } else if (seccion === 'consultar') {
        consultarRegistrosAlimentacion();
        contenedorTablaAlimentacion.style.display = 'block';
    } else if (seccion === 'modificar') {
        modificarAlimentacionContainer.style.display = 'block';
    }
}

// Event listeners para botones principales
btnRegistrar.addEventListener('click', () => mostrarSeccion('registrar'));
btnConsultar.addEventListener('click', () => mostrarSeccion('consultar'));
btnModificar.addEventListener('click', () => mostrarSeccion('modificar'));

// Función para registrar un nuevo alimento
btnGuardarAlimentacion.addEventListener('click', () => {
    const tipoAlimento = document.getElementById('tipoAlimento').value;
    const cantidadAlimento = document.getElementById('cantidadAlimento').value;
    const frecuenciaAlimento = document.getElementById('frecuenciaAlimento').value;

    if (tipoAlimento && cantidadAlimento && frecuenciaAlimento) {
        const nuevoRegistro = {
            tipo: tipoAlimento,
            cantidad: parseInt(cantidadAlimento),
            frecuencia: frecuenciaAlimento
        };

        // Petición simulada al backend para registrar un nuevo alimento
        fetch('/api/registrarAlimento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoRegistro)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Alimento registrado con éxito.');
                limpiarInputs();
            } else {
                alert('Error al registrar el alimento.');
            }
        })
        .catch(error => {
            console.error('Error al registrar el alimento:', error);
            alert('Hubo un problema al conectar con el servidor.');
        });
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

// Función para consultar registros
function consultarRegistrosAlimentacion() {
    fetch('/api/consultarAlimentos')
        .then(response => response.json())
        .then(data => {
            tablaAlimentacion.innerHTML = ''; // Limpiar la tabla

            if (data.length === 0) {
                mensajeNoEncontradoAlimentacion.style.display = 'block';
                return;
            }

            mensajeNoEncontradoAlimentacion.style.display = 'none';

            data.forEach(registro => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${registro.id || 'N/A'}</td>
                    <td>${registro.tipo || 'N/A'}</td>
                    <td>${registro.cantidad || 'N/A'}</td>
                    <td>${registro.frecuencia || 'N/A'}</td>
                    <td>${registro.fecha || 'N/A'}</td>
                `;
                tablaAlimentacion.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al consultar los registros:', error);
            mensajeNoEncontradoAlimentacion.style.display = 'block';
        });
}

// Función para limpiar los inputs después de registrar
function limpiarInputs() {
    document.getElementById('tipoAlimento').value = '';
    document.getElementById('cantidadAlimento').value = '';
    document.getElementById('frecuenciaAlimento').value = '';
}

// Función para modificar un alimento
btnModificarAlimentacion.addEventListener('click', () => {
    const idModificar = parseInt(document.getElementById('idModificarAlimento').value);
    const nuevoTipo = document.getElementById('nuevoTipoAlimento').value;
    const nuevaCantidad = document.getElementById('nuevaCantidadAlimento').value;
    const nuevaFrecuencia = document.getElementById('nuevaFrecuenciaAlimento').value;

    const datosModificacion = {
        id: idModificar,
        nuevoTipo: nuevoTipo || null,
        nuevaCantidad: nuevaCantidad ? parseInt(nuevaCantidad) : null,
        nuevaFrecuencia: nuevaFrecuencia || null
    };

    // Petición simulada al backend para modificar un alimento
    fetch('/api/modificarAlimento', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosModificacion)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registro modificado con éxito.');
            consultarRegistrosAlimentacion(); // Actualiza la tabla después de modificar
        } else {
            alert('No se encontró un registro con el ID proporcionado.');
        }
    })
    .catch(error => {
        console.error('Error al modificar el registro:', error);
        alert('Hubo un problema al conectar con el servidor.');
    });
});

// Función para volver al menú principal
function volverAlMenu() {
    const alimentacionInputs = document.getElementById("alimentacionInputs");
    const contenedorTablaAlimentacion = document.getElementById("contenedorTablaAlimentacion");
    const modificarAlimentacionContainer = document.getElementById("modificarAlimentacionContainer");
    const eliminarAlimentoContainer = document.getElementById("eliminarAlimentoContainer");

    // Ocultar todos los contenedores si alguno está visible
    if (
        alimentacionInputs.style.display !== "none" ||
        contenedorTablaAlimentacion.style.display !== "none" ||
        modificarAlimentacionContainer.style.display !== "none" ||
        eliminarAlimentoContainer.style.display !== "none"
    ) {
        ocultarTodosLosContenedores();
    } else {
        // Si ya están ocultos, redirige al menú principal
        window.location.href = "/Ganadero.html";
    }
}


// Función para ocultar todos los contenedores
function ocultarTodosLosContenedores() {
    const contenedores = [
        "alimentacionInputs",
        "contenedorTablaAlimentacion",
        "modificarAlimentacionContainer",
        "eliminarAlimentoContainer",
    ];

    contenedores.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.display = "none";
        }
    });
}



// Función para eliminar alimento
function eliminarAlimento() {
    const contenedorEliminar = document.getElementById('eliminarAlimentoContainer');
    if (contenedorEliminar) {
        contenedorEliminar.style.display = 'block';
    }

    // Obtener referencia al botón de confirmación
    const btnConfirmar = document.getElementById('btnConfirmarEliminarAlimento');
    if (btnConfirmar) {
        // Evitar acumulación de eventos eliminando cualquier listener previo
        btnConfirmar.onclick = null;

        // Asignar nuevo evento
        btnConfirmar.onclick = function () {
            const idAlimento = document.getElementById('idAlimentoEliminar').value.trim();

            if (!idAlimento) {
                alert('Por favor, ingrese un ID válido.');
                return;
            }

            if (confirm('¿Está seguro de que desea eliminar el alimento con ID ' + idAlimento + '?')) {
                // Simular eliminación con fetch
                fetch(`URL_DEL_ENDPOINT_ALIMENTO/${idAlimento}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Alimento eliminado exitosamente.');
                        document.getElementById('idAlimentoEliminar').value = '';
                        contenedorEliminar.style.display = 'none'; // Ocultar después de eliminar
                    } else {
                        alert('Error al eliminar el alimento. Por favor, intente nuevamente.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Ocurrió un error al intentar eliminar el alimento.');
                });
            }
        };
    }
}
