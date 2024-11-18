function mostrarSeccion(seccion) {
    switch (seccion) {
        case 'ganado':
            window.location.href = 'http://127.0.0.1:5000//encargado/ganado';
            break;
        case 'alimentacion':
            window.location.href = 'http://127.0.0.1:5000//encargado/alimentacion';
            break;
        case 'alertas':
            window.location.href = 'http://127.0.0.1:5000//encargado/alertas';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000//login';
            break;
        default:
            window.location.href = 'http://127.0.0.1:5000//encargado/alimentaciongrupo';
            break;
    }
}
function ocultarTodosLosContenedores() {
    document.getElementById("tablaAlimentacion").style.display = "none";
    document.getElementById("contenedorConsultaAlimentacion").style.display = "none";
    document.getElementById("vincularAlimentacionContainer").style.display = "none";
    document.getElementById("modificarAlimentacionContainer").style.display = "none";
}





// Botón de la sección de modificación de alimento
document.getElementById("btnModificarAlimentacion").onclick = function() {
    ocultarTodosLosContenedores(); // Oculta todos los contenedores
    document.getElementById("modificarAlimentacionContainer").style.display = "block"; // Muestra solo el contenedor de modificación
};

// Función para volver al menú
function volverAlMenu() {
    const tablaAlimentacion = document.querySelector("#tablaAlimentacion");
    const contenedorConsultaAlimentacion = document.querySelector("#contenedorConsultaAlimentacion");
    const vincularAlimentacionContainer = document.querySelector("#vincularAlimentacionContainer");
    const modificarAlimentacionContainer = document.querySelector("#modificarAlimentacionContainer");

    // Verifica si alguno de los contenedores está visible
    if (tablaAlimentacion.style.display === "none" &&
        contenedorConsultaAlimentacion.style.display === "none" &&
        vincularAlimentacionContainer.style.display === "none" &&
        modificarAlimentacionContainer.style.display === "none") {
        // Redirige a Encargado.html si no hay contenedores visibles
        window.location.href = "http://127.0.0.1:5000/encargado";
    } else {
        // Oculta todos los contenedores visibles
        tablaAlimentacion.style.display = "none";
        contenedorConsultaAlimentacion.style.display = "none";
        vincularAlimentacionContainer.style.display = "none";
        modificarAlimentacionContainer.style.display = "none";
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
        const response = await fetch('http://127.0.0.1:5000/encargado/consultas', {
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


//funcion de mostrar

function mostrarbloques(){
    document.getElementById("contenedorConsultaAlimentacion").style.display = "block";
}

// Función para consultar la alimentación por ID
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
    fetch("/encargado/consultasvinculacion", {
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


async function buscarAlimentacion() {
    ocultarTodosLosContenedores();
    const idGanado = document.getElementById('inputIDGanadoModificar').value;

    if (!idGanado) {
        alert('Por favor, ingrese el ID del ganado.');
        return;
    }
    const userData={ id:idGanado}

    try {
        // Realizar la solicitud al servidor utilizando fetch con await
        const response = await fetch('http://127.0.0.1:5000/encargado/consultasvinculacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        console.log(data)
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener la información 1');
        }
        const data = await response.json();
        // Convertir la respuesta a JSON

        
        const tbody = document.querySelector('#tablaAlimentacionModificar tbody');
        tbody.innerHTML = '';

        if (data.length > 0) {
            data.forEach(item => {
                const row = `<tr>
                    <td>${item.id_alimentacion || "N/A"}</td>
                    <td>${item.tipo_alimento || "N/A"}</td>
                    <td>${item.cantidad || "N/A"}</td>
                    <td>${item.frecuencia || "N/A"}</td>
                    <td>${item.fecha_registro || "N/A"}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
            document.getElementById('tablaAlimentacionModificar').style.display = 'table';
            document.getElementById('mensajeNoEncontradoAlimentacion').style.display = 'none';
        } else {
            document.getElementById('tablaAlimentacionModificar').style.display = 'none';
            document.getElementById('mensajeNoEncontradoAlimentacion').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener la información 2.');
    }
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


function mostrarVincularAlimentacion(){
    document.getElementById('camposVinculacion').style.display = 'block';
}