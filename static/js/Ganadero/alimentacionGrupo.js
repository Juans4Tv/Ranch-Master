function mostrarSeccio(seccion) {
    switch (seccion) {
        case 'ganado':
            window.location.href = 'http://127.0.0.1:5000/ganadero/ganado';
            break;
        case 'alimentacion':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alimentacion';
            break;
        case 'alertas':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alertas';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000/login';
            break;
        default:
            window.location.href = 'http://127.0.0.1:5000/ganadero/alimentaciongrupo';
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
        window.location.href = "http://127.0.0.1:5000/ganadero";
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
async function consultarAlimentacion() {
    ocultarTodosLosContenedores();
    document.getElementById("tablaAlimentacion").style.display = "block";

    const mensajeNoEncontradoAlimentacion = document.getElementById("mensajeNoEncontradoAlimentacionRegistrada");
    const tbody = document.querySelector("#tablaAlimentacionRegistrada tbody");

    try {
        // Solicitar datos desde el archivo JSON
        const userData = { name: 'alimentacion' };
        const response = await fetch('http://127.0.0.1:5000/ganadero/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error("No se pudo obtener los datos");
        }

        const data = await response.json();
        tbody.innerHTML = ""; // Limpiar la tabla antes de llenarla

        if (data.length === 0) {
            mensajeNoEncontradoAlimentacion.style.display = "block";
        } else {
            mensajeNoEncontradoAlimentacion.style.display = "none"; // Ocultar el mensaje

            data.forEach((registro) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${registro.id_alimentacion || "N/A"}</td>
                    <td>${registro.tipo_alimento || "N/A"}</td>
                    <td>${registro.cantidad || "N/A"}</td>
                    <td>${registro.frecuencia || "N/A"}</td>
                    <td>${registro.fecha_registro || "N/A"}</td>
                `;
                tbody.appendChild(fila);
            });
        }
    } catch (error) {
        console.error("Error al obtener los datos de alimentación registrada:", error);
        mensajeNoEncontradoAlimentacion.style.display = "block";
    }
}

function mostrarbloques(){
    document.getElementById("contenedorConsultaAlimentacion").style.display = "block";
}
// Función para consultar la alimentación por ID


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
async function vincularAlimentacion() {
    ocultarTodosLosContenedores();
    const idGanado = document.getElementById('inputIDGanadoVincular').value;
    const idAlimentacion = document.getElementById('inputIDAlimentacionVincular').value;

    if (!idAlimentacion) {
        alert('Por favor, ingrese el ID de la alimentación.');
        return;
    }

    // Datos para enviar en el JSON
    const datosVinculacion = {
        tabla: 'vinculacion',
        tipo: 0,
        cantidad: idAlimentacion,
        fecha: 0,
        frecuencia: 0,
        id_usuario: idGanado,
    };

    try {
        // Simulación de petición POST a la base de datos
        const response = await fetch('http://127.0.0.1:5000/encargado/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosVinculacion)
        });

        const data = await response.json();  // Esperar la respuesta y parsearla

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

    } catch (error) {
        console.error('Error:', error);
        alert('Error en la vinculación.');
    }
}

function consultarAlimentacionGanado() {
    const mensajeNoEncontradoAlimentacion = document.getElementById("mensajeNoEncontradoAlimentacionGanado");
    const tbody = document.querySelector("#tablaAlimentacionGanado tbody");
    const idGanado = document.getElementById("inputIDGanado").value.trim();

    // Verificar que se haya ingresado el ID de ganado
    if (!idGanado) {
        alert("Por favor, ingresa el ID del ganado.");
        return;
    }

    // Enviar solicitud POST con el ID del ganado
    fetch("/ganadero/consultasvinculacion", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: idGanado })  // Enviamos el ID del ganado como JSON
    })
    .then(response => response.json())
    .then(data => {
        tbody.innerHTML = ""; // Limpiar la tabla antes de llenarla

        // Si la respuesta tiene datos, llenar la tabla
        if (data.length > 0) {
            data.forEach(registro => {

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${registro.id_alimentacion || "N/A"}</td>
                    <td>${registro.tipo_alimento || "N/A"}</td>
                    <td>${registro.cantidad || "N/A"}</td>
                    <td>${registro.frecuencia || "N/A"}</td>
                    <td>${registro.fecha_registro || "N/A"}</td>
                `;
                tbody.appendChild(fila);
            });
            document.getElementById("tablaAlimentacionGanado").style.display = "table";
            mensajeNoEncontradoAlimentacion.style.display = "none";
        } else {
            document.getElementById("tablaAlimentacionGanado").style.display = "none";
            mensajeNoEncontradoAlimentacion.style.display = "block"; // Mostrar mensaje si no hay datos
        }
    })
    .catch(error => {
        console.error("Error al obtener los datos de alimentación del ganado:", error);
        mensajeNoEncontradoAlimentacion.style.display = "block";
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
        tabla:'vinculacion',
        idex: idGanado,
        id: idAlimentacion
    };

    // Simulación de petición POST para eliminar alimentación
    fetch('http://127.0.0.1:5000/ganadero/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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

function mostrarVincularAlimentacion(){
    document.getElementById('camposVinculacion').style.display = 'block';
}