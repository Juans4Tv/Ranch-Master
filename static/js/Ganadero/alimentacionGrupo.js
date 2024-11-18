function mostrarSeccio(seccion) {
    switch (seccion) {
        case 'ganado':
            window.location.href = '/Ganadero/ganado.html';
            break;
        case 'alimentacion':
            window.location.href = '/Ganadero/alimentacion.html';
            break;
        case 'alertas':
            window.location.href = '/Ganadero/alertasAgua.html';
            break;
        case 'cerrar':
            window.location.href = '/IniciarSesion.html';
            break;
        default:
            window.location.href = '/Ganadero/alimentacionGrupo.html';
            break;
    }
}
function ocultarTodosLosContenedores() {
    const contenedores = [
        "tablaAlimentacion",
        "contenedorConsultaAlimentacion",
        "vincularAlimentacionContainer",
        "modificarAlimentacionContainer",
        "eliminarAlimentacionContainer",
        "tablaAlimentacionGanadoContainer"
    ];

    contenedores.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.display = "none";
        }
    });
}


// Botón de la sección de consulta de alimentación del ganado
document.getElementById("btnConsultarAlimentacionGanado").onclick = function() {
    ocultarTodosLosContenedores(); // Oculta todos los contenedores
    document.getElementById("contenedorConsultaAlimentacion").style.display = "block"; // Muestra solo el contenedor de consulta
};

// Botón de la sección de vinculación de alimentación
document.getElementById("btnVincularAlimentacion").onclick = function() {
    ocultarTodosLosContenedores(); // Oculta todos los contenedores
    document.getElementById("vincularAlimentacionContainer").style.display = "block"; // Muestra solo el contenedor de vinculación
};

// Botón de la sección de modificación de alimento
document.getElementById("btnModificarAlimentacion").onclick = function() {
    ocultarTodosLosContenedores(); // Oculta todos los contenedores
    document.getElementById("modificarAlimentacionContainer").style.display = "block"; // Muestra solo el contenedor de modificación
};

function volverAlMenu() {
    const contenedores = [
        document.getElementById("tablaAlimentacion"),
        document.getElementById("contenedorConsultaAlimentacion"),
        document.getElementById("vincularAlimentacionContainer"),
        document.getElementById("modificarAlimentacionContainer"),
        document.getElementById("eliminarAlimentacionContainer"),
        document.getElementById("tablaAlimentacionGanadoContainer")
    ];

    // Verificar si algún contenedor está visible
    const algunContenedorVisible = contenedores.some(contenedor => contenedor && contenedor.style.display !== "none");

    if (!algunContenedorVisible) {
        // Redirige al menú principal
        window.location.href = "/Encargado.html";
    } else {
        // Oculta todos los contenedores visibles
        contenedores.forEach(contenedor => {
            if (contenedor) {
                contenedor.style.display = "none";
            }
        });
    }
}


// Función para consultar la alimentación registrada
function consultarAlimentacion() {
    ocultarTodosLosContenedores();
    document.getElementById("tablaAlimentacion").style.display = "block";

    const mensajeNoEncontradoAlimentacion = document.getElementById("mensajeNoEncontradoAlimentacionRegistrada");
    const tbody = document.querySelector("#tablaAlimentacionRegistrada tbody");

    // Solicitar datos desde el archivo JSON
    fetch("/data/alimentacionRegistrada.json")
        .then((response) => response.json())
        .then((data) => {
            tbody.innerHTML = ""; // Limpiar la tabla antes de llenarla

            if (data.length === 0) {
                mensajeNoEncontradoAlimentacion.style.display = "block";
            } else {
                mensajeNoEncontradoAlimentacion.style.display = "none"; // Ocultar el mensaje

                data.forEach((registro) => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${registro.id || "N/A"}</td>
                        <td>${registro.tipo || "N/A"}</td>
                        <td>${registro.cantidad || "N/A"}</td>
                        <td>${registro.frecuencia || "N/A"}</td>
                        <td>${registro.fecha || "N/A"}</td>
                    `;
                    tbody.appendChild(fila);
                });
            }
        })
        .catch((error) => {
            console.error("Error al obtener los datos de alimentación registrada:", error);
            mensajeNoEncontradoAlimentacion.style.display = "block";
        });
}

// Función para consultar la alimentación por ID
function consultarAlimentacionGanado() {
    ocultarTodosLosContenedores();
    document.getElementById("contenedorConsultaAlimentacion").style.display = "block";

    const mensajeNoEncontradoAlimentacion = document.getElementById("mensajeNoEncontradoAlimentacionGanado");
    const tbody = document.querySelector("#tablaAlimentacionGanado tbody");
    const idGanado = document.getElementById("inputIDGanado").value.trim();

    // Solicitar datos desde el archivo JSON
    fetch("/data/alimentacionGanado.json")
        .then((response) => response.json())
        .then((data) => {
            tbody.innerHTML = ""; // Limpiar la tabla antes de llenarla

            const registros = data.filter((registro) => registro.id === idGanado);

            if (registros.length === 0) {
                mensajeNoEncontradoAlimentacion.style.display = "block";
            } else {
                mensajeNoEncontradoAlimentacion.style.display = "none"; // Ocultar el mensaje

                registros.forEach((registro) => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${registro.id || "N/A"}</td>
                        <td>${registro.tipo || "N/A"}</td>
                        <td>${registro.cantidad || "N/A"}</td>
                        <td>${registro.frecuencia || "N/A"}</td>
                        <td>${registro.fecha || "N/A"}</td>
                    `;
                    tbody.appendChild(fila);
                });
            }
        })
        .catch((error) => {
            console.error("Error al obtener los datos de alimentación del ganado:", error);
            mensajeNoEncontradoAlimentacion.style.display = "block";
        });
}

function buscarAlimentacion() {
    ocultarTodosLosContenedores();
    const idGanado = document.getElementById('inputIDGanadoModificar').value;

    if (!idGanado) {
        alert('Por favor, ingrese el ID del ganado.');
        return;
    }

    fetch(`URL_DEL_ENDPOINT?idGanado=${idGanado}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#tablaAlimentacionModificar tbody');
        tbody.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const row = `<tr>
                    <td>${item.idAlimentacion || 'N/A'}</td>
                    <td>${item.tipoAlimento || 'N/A'}</td>
                    <td>${item.cantidad || 'N/A'}</td>
                    <td>${item.frecuencia || 'N/A'}</td>
                    <td>${item.fechaRegistro || 'N/A'}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
            document.getElementById('tablaAlimentacionModificar').style.display = 'table';
            document.getElementById('mensajeNoEncontradoAlimentacion').style.display = 'none';
        } else {
            document.getElementById('tablaAlimentacionModificar').style.display = 'none';
            document.getElementById('mensajeNoEncontradoAlimentacion').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al obtener la información.');
    });
}

// Función para mostrar el contenedor de vinculación
function mostrarCamposVinculacion() {
    document.getElementById('vincularAlimentacionContainer').style.display = 'block';
}

// Función para buscar el ID del ganado y mostrar los campos de vinculación si existe
function buscarGanado() {
    ocultarTodosLosContenedores();
    const idGanado = document.getElementById('inputIDGanadoVincular').value;

    if (!idGanado) {
        alert('Por favor, ingrese el ID del ganado.');
        return;
    }

    // Simulación de petición GET para verificar el ID del ganado en la base de datos
    fetch(`URL_DEL_ENDPOINT_VERIFICAR_GANADO?idGanado=${idGanado}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.existe) {
            // Mostrar los campos de vinculación si el ID del ganado es válido
            document.getElementById('camposVinculacion').style.display = 'block';
        } else {
            alert('ID del ganado no encontrado. Verifique e intente nuevamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al verificar el ID del ganado.');
    });
}

// Función para vincular el ID del ganado con el ID de la alimentación
function vincularAlimentacion() {
    ocultarTodosLosContenedores();
    const idGanado = document.getElementById('inputIDGanadoVincular').value;
    const idAlimentacion = document.getElementById('inputIDAlimentacionVincular').value;

    if (!idAlimentacion) {
        alert('Por favor, ingrese el ID de la alimentación.');
        return;
    }

    // Datos para enviar en el JSON
    const datosVinculacion = {
        idGanado: idGanado,
        idAlimentacion: idAlimentacion
    };

    // Simulación de petición POST a la base de datos
    fetch('URL_DEL_ENDPOINT_VINCULACION', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosVinculacion)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('mensajeVinculacionExitosa').style.display = 'block';
            setTimeout(() => {
                document.getElementById('mensajeVinculacionExitosa').style.display = 'none';
                document.getElementById('camposVinculacion').style.display = 'none';
                document.getElementById('inputIDGanadoVincular').value = '';
                document.getElementById('inputIDAlimentacionVincular').value = '';
                document.getElementById('vincularAlimentacionContainer').style.display = 'none';
            }, 3000);
        } else {
            alert('Error en la vinculación.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en la vinculación.');
    });
}

function consultarAlimentacionGanado() {
    const tablaContainer = document.getElementById('tablaAlimentacionGanadoContainer');
    const tablaBody = document.getElementById('tablaAlimentacionGanado').querySelector('tbody');
    const mensajeNoDatos = document.getElementById('mensajeNoDatosGanado');

    // Ocultar todos los contenedores antes de mostrar la tabla (opcional si tienes múltiples vistas)
    ocultarTodosLosContenedores();

    // Simulación de petición GET para consultar datos de alimentación
    fetch('URL_DEL_ENDPOINT_CONSULTA_ALIMENTACION', {
        method: 'GET', // Cambiar a POST si necesitas enviar parámetros
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Limpiar la tabla antes de mostrar nuevos datos
        tablaBody.innerHTML = '';

        if (data.length > 0) {
            // Llenar la tabla con los datos recibidos
            data.forEach(dato => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${dato.raza}</td>
                    <td>${dato.idAlimentacion}</td>
                    <td>${dato.tipo}</td>
                    <td>${dato.cantidad} kg</td>
                    <td>${dato.frecuencia}</td>
                    <td>${dato.fecha}</td>
                `;
                tablaBody.appendChild(fila);
            });

            mensajeNoDatos.style.display = 'none';
            tablaContainer.style.display = 'block';
        } else {
            // Mostrar mensaje si no hay datos
            mensajeNoDatos.style.display = 'block';
            tablaContainer.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error en la consulta:', error);
        alert('Hubo un problema al conectar con el servidor.');
    });
}

function mostrarEliminarAlimentacion() {
    document.getElementById('eliminarAlimentacionContainer').style.display = 'block';
}

function eliminarAlimentacion() {
    const idGanado = document.getElementById('inputIDGanadoEliminar').value;
    const idAlimentacion = document.getElementById('inputIDAlimentacionEliminar').value;
    const mensajeExito = document.getElementById('mensajeEliminacionExitosa');

    // Validación básica de los inputs
    if (!idGanado || !idAlimentacion) {
        alert('Por favor, ingrese ambos IDs.');
        return;
    }

    // Datos para enviar en el JSON
    const datosEliminacion = {
        idGanado: idGanado,
        idAlimentacion: idAlimentacion
    };

    // Simulación de petición POST para eliminar alimentación
    fetch('URL_DEL_ENDPOINT_ELIMINACION', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEliminacion)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de éxito
            mensajeExito.style.display = 'block';
            setTimeout(() => {
                mensajeExito.style.display = 'none';
                // Limpiar inputs
                document.getElementById('inputIDGanadoEliminar').value = '';
                document.getElementById('inputIDAlimentacionEliminar').value = '';
            }, 3000);
        } else {
            alert('Error al eliminar la alimentación. Verifique los IDs ingresados.');
        }
    })
    .catch(error => {
        console.error('Error en la eliminación:', error);
        alert('Hubo un problema al conectar con el servidor.');
    });
}
