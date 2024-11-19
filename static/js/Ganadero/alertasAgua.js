function mostrarSeccio(seccion) {
    switch (seccion) {
        case 'ganado':
            window.location.href = 'http://127.0.0.1:5000/ganadero/ganado';
            break;
        case 'alimentacion':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alimentacion';
            break;
        case 'vinculacion':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alimentaciongrupo';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000/login';
            break;
        default:
            window.location.href = 'http://127.0.0.1:5000/ganadero/alertas';
            break;
    }
}

// Función para volver al menú
function volverAlMenu() {
    // Lista de IDs de contenedores dinámicos
    const contenedores = [
        "#registroAlertaContainer",
        "#contenedorAlertasActivas",
        "#contenedorHistorialAlertas",
        "#contenedorInputAlerta",
        "#pantallaConfirmacion",
        "#contenedorModificarAlerta"
    ];

    let algunContenedorVisible = false;

    // Ocultar contenedores si alguno está visible
    contenedores.forEach(id => {
        const contenedor = document.querySelector(id);
        if (contenedor && contenedor.style.display !== "none") {
            contenedor.style.display = "none";
            algunContenedorVisible = true;
        }
    });

    if (!algunContenedorVisible) {
        // Si no hay contenedores visibles, redirigir a Encargado.html
        window.location.href = "/Encargado.html";
    }
}

function mostrarRegistroAlerta() {
    document.getElementById('registroAlertaContainer').style.display = 'block';
}

function registrarAlertaAgua() {
    // Obtener el valor del input
    const nivelAgua = document.getElementById('inputNivelAgua').value;

    // Validar si el valor está vacío o no es un número válido
    if (!nivelAgua || isNaN(nivelAgua) || nivelAgua <= 0) {
        alert('Por favor, ingrese un nivel de agua válido.');
        return; // Detiene el proceso si el valor no es válido
    }

    // Crear el objeto de datos para enviar al backend
    const alertaData = {
        nivelAgua: parseFloat(nivelAgua),
        fecha: new Date().toISOString() // Registrar la fecha de la alerta
    };

    // Enviar los datos al servidor utilizando fetch y JSON
    fetch('URL_DEL_ENDPOINT_DE_ALERTA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertaData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Alerta de agua registrada exitosamente.');
            document.getElementById('inputNivelAgua').value = ''; // Limpiar el input
        } else {
            alert('Error al registrar la alerta. Por favor, intente nuevamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al registrar la alerta.');
    });
}

function consultarAlertasActivas() {
    const tablaAlertas = document.getElementById('tablaAlertasActivas');
    const contenedorAlertas = document.getElementById('contenedorAlertasActivas');
    contenedorAlertas.style.display = 'block'; // Mostrar el contenedor

    // Mostrar mensaje de carga
    tablaAlertas.innerHTML = `
        <tr>
            <td class="alerta-cargando">Cargando alertas activas...</td>
        </tr>
    `;

    // Simular consulta al backend
    fetch('URL_DEL_ENDPOINT_DE_ALERTAS_ACTIVAS') // Reemplaza con tu URL del backend
        .then(response => response.json())
        .then(data => {
            // Limpiar la tabla de alertas
            tablaAlertas.innerHTML = '';

            if (data.alertas && data.alertas.length > 0) {
                // Recorrer las alertas y agregarlas a la tabla
                data.alertas.forEach(alerta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${alerta.id}</td>
                    `;
                    tablaAlertas.appendChild(row);
                });
            } else {
                // Mostrar mensaje si no hay alertas activas
                tablaAlertas.innerHTML = `
                    <tr>
                        <td class="alerta-vacia">Información no registrada.</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Error al consultar alertas activas:', error);
            tablaAlertas.innerHTML = `
                <tr>
                    <td class="alerta-error">Error al cargar las alertas activas.</td>
                </tr>
            `;
        });
}

function consultarHistorialAlertas() {
    const tablaHistorial = document.getElementById('tablaHistorialAlertas');
    const contenedorHistorial = document.getElementById('contenedorHistorialAlertas');
    contenedorHistorial.style.display = 'block'; // Mostrar el contenedor

    // Mostrar mensaje de carga
    tablaHistorial.innerHTML = `
        <tr>
            <td colspan="5" class="alerta-cargando">Cargando historial de alertas...</td>
        </tr>
    `;

    // Simular consulta al backend
    fetch('URL_DEL_ENDPOINT_DEL_HISTORIAL') // Reemplaza con tu URL del backend
        .then(response => response.json())
        .then(data => {
            // Limpiar la tabla
            tablaHistorial.innerHTML = '';

            if (data.alertas && data.alertas.length > 0) {
                // Recorrer las alertas y agregarlas a la tabla
                data.alertas.forEach(alerta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${alerta.id}</td>
                        <td>${alerta.nivel_agua}</td>
                        <td>${new Date(alerta.fecha).toLocaleDateString()}</td>
                        <td>${alerta.id_usuario}</td>
                        <td>${alerta.estado}</td>
                    `;
                    tablaHistorial.appendChild(row);
                });
            } else {
                // Mostrar mensaje si no hay alertas registradas
                tablaHistorial.innerHTML = `
                    <tr>
                        <td colspan="5" class="alerta-vacia">No hay alertas registradas.</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Error al consultar el historial de alertas:', error);
            tablaHistorial.innerHTML = `
                <tr>
                    <td colspan="5" class="alerta-error">Error al cargar el historial de alertas.</td>
                </tr>
            `;
        });
}
// Función para mostrar el contenedor de ingreso de ID de alerta
function mostrarResolverAlerta() {
    document.getElementById('contenedorInputAlerta').style.display = 'block';
}

// Función para mostrar la pantalla superpuesta
function mostrarPantallaSuperpuesta() {
    const idAlerta = document.getElementById('inputIdAlerta').value;

    if (!idAlerta) {
        alert('Por favor, ingrese el ID de la alerta.');
        return;
    }

    // Guardar temporalmente el ID de la alerta (variable global)
    window.idAlertaActual = idAlerta;

    // Ocultar el contenedor de ingreso y mostrar la pantalla superpuesta
    document.getElementById('contenedorInputAlerta').style.display = 'none';
    document.getElementById('pantallaConfirmacion').style.display = 'flex';
}

// Función para resolver el estado de la alerta
function resolverEstadoAlerta(estado) {
    const idAlerta = window.idAlertaActual;

    if (!idAlerta) {
        alert('No se encontró un ID de alerta válido.');
        return;
    }

    // Crear objeto para enviar al backend
    const datosAlerta = {
        idAlerta: idAlerta,
        estado: estado
    };

    // Enviar datos al backend utilizando fetch y JSON
    fetch('URL_DEL_ENDPOINT_RESOLVER_ALERTA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosAlerta)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`La alerta ha sido marcada como ${estado}.`);
            } else {
                alert('Hubo un problema al actualizar la alerta. Intente nuevamente.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al conectar con el servidor.');
        });

    // Ocultar la pantalla superpuesta
    document.getElementById('pantallaConfirmacion').style.display = 'none';

    // Limpiar el input
    document.getElementById('inputIdAlerta').value = '';
}

// Mostrar el contenedor de modificación de alerta
function mostrarContenedorModificarAlerta() {
    document.getElementById('contenedorModificarAlerta').style.display = 'block';
}

// Lógica para validar y modificar la alerta
document.getElementById('btnModificarAlerta').addEventListener('click', function () {
    // Obtener los valores ingresados por el usuario
    const idAlerta = document.getElementById('inputIdAlertaModificar').value.trim();
    const nuevoNivelAgua = document.getElementById('inputNuevoNivelAgua').value.trim();
    const nuevoEstado = document.getElementById('selectEstadoAlerta').value;

    // Crear el objeto de datos para enviar al backend
    const datosModificacion = {
        idAlerta: parseInt(idAlerta),
        nivelAgua: parseFloat(nuevoNivelAgua),
        estado: nuevoEstado,
    };

    // Enviar datos al backend con fetch
    fetch('URL_DEL_ENDPOINT_DE_MODIFICACION', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosModificacion),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('Modificación completada exitosamente.');
                // Limpiar los campos después de la modificación
                document.getElementById('inputIdAlertaModificar').value = '';
                document.getElementById('inputNuevoNivelAgua').value = '';
                document.getElementById('selectEstadoAlerta').value = 'activa';
            } else {
                alert('Hubo un error al modificar la alerta. Por favor, intente nuevamente.');
            }
        })
});
