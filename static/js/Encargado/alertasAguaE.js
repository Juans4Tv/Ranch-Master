function mostrarSeccion(seccion) {
    switch (seccion) {
        case 'ganado':
            window.location.href = 'http://127.0.0.1:5000//encargado/ganado';
            break;
        case 'alimentacion':
            window.location.href = 'http://127.0.0.1:5000//encargado/alimentacion';
            break;
        case 'vinculacion':
            window.location.href = 'http://127.0.0.1:5000//encargado/alimentaciongrupo';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000//login';
            break;
        default:
            window.location.href = 'http://127.0.0.1:5000//encargado/alertas';
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
        window.location.href = "http://127.0.0.1:5000/encargado";
    }
}

function mostrarRegistroAlerta() {
    document.getElementById('registroAlertaContainer').style.display = 'block';
}
//NO OLVIDAR QUE FALTA AÑADIR EN CANTIDAD EL ENUM
function registrarAlertaAgua() {
    // Obtener el valor del input
    const nivelAgua = document.getElementById('inputNivelAgua').value;

        // Obtener la fecha y hora actual
        const fechaActual = new Date();

        // Formatear la fecha en un formato más legible (por ejemplo, YYYY-MM-DD)
        const anio = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve un valor de 0 a 11, por lo que se le suma 1
        const dia = String(fechaActual.getDate()).padStart(2, '0');
    
        const fechaFormateada = `${anio}-${mes}-${dia}`;
    
        // Si necesitas incluir la hora también
        const horas = String(fechaActual.getHours()).padStart(2, '0');
        const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
        const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
    
        const fechaHoraFormateada = `${fechaFormateada} ${horas}:${minutos}:${segundos}`;
        
    // Validar si el valor está vacío o no es un número válido
    if (!nivelAgua || isNaN(nivelAgua) || nivelAgua <= 0) {
        alert('Por favor, ingrese un nivel de agua válido.');
        return; // Detiene el proceso si el valor no es válido
    }

    // Crear el objeto de datos para enviar al backenf
    const nuevoRegistro = {
        tabla: 'alertas',
        tipo: parseFloat(nivelAgua),
        //AQUI
        cantidad: 'activa',
        fecha: fechaHoraFormateada,  // Usar la fecha con hora
        frecuencia: 0,
        id_usuario: 2
    };
    // Enviar los datos al servidor utilizando fetch y JSON
    fetch('http://127.0.0.1:5000/encargado/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoRegistro)
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

async function consultarAlertasActivas() {
    const tablaAlertas = document.getElementById('tablaAlertasActivas');
    const contenedorAlertas = document.getElementById('contenedorAlertasActivas');
    contenedorAlertas.style.display = 'block'; // Mostrar el contenedor

    // Mostrar mensaje de carga
    tablaAlertas.innerHTML = `
        <tr>
            <td class="alerta-cargando">Cargando alertas activas...</td>
        </tr>
    `;

    try {
        // Simular consulta al backend
        const response = await fetch('http://127.0.0.1:5000/encargado/consultaestado'); // Reemplaza con tu URL del backend
        const data = await response.json();

        // Limpiar la tabla de alertas
        tablaAlertas.innerHTML = '';
        console.log(data[0].estado_alerta)
        if (data[0].estado_alerta.length> 0) {
            // Recorrer las alertas y agregarlas a la tabla
            data.forEach(alerta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${alerta.id_alerta}</td>
                    <td>${alerta.estado_alerta}</td>
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
    } catch (error) {
        console.error('Error al consultar alertas activas:', error);
        tablaAlertas.innerHTML = `
            <tr>
                <td class="alerta-error">Error al cargar las alertas activas.</td>
            </tr>
        `;
    }
}


async function consultarHistorialAlertas() {
    const tablaHistorial = document.getElementById('tablaHistorialAlertas');
    const contenedorHistorial = document.getElementById('contenedorHistorialAlertas');
    contenedorHistorial.style.display = 'block'; // Mostrar el contenedor

    // Mostrar mensaje de carga
    tablaHistorial.innerHTML = `
        <tr>
            <td colspan="5" class="alerta-cargando">Cargando historial de alertas...</td>
        </tr>
    `;
    const userData = { name: 'alertas_agua' };
    try {
        // Simular consulta al backend
        const response = await fetch('http://127.0.0.1:5000/encargado/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }); // Reemplaza con tu URL del backend
        const data = await response.json();

        // Limpiar la tabla
        tablaHistorial.innerHTML = '';

        if (data[0].estado_alerta.length > 0) {
            // Recorrer las alertas y agregarlas a la tabla
            data.forEach(alerta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${alerta.id_alerta}</td>
                    <td>${alerta.nivel_agua}</td>
                    <td>${alerta.fecha_alerta}</td>
                    <td>${alerta.id_usuario}</td>
                    <td>${alerta.estado_alerta}</td>
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
    } catch (error) {
        console.error('Error al consultar el historial de alertas:', error);
        tablaHistorial.innerHTML = `
            <tr>
                <td colspan="5" class="alerta-error">Error al cargar el historial de alertas.</td>
            </tr>
        `;
    }
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




function modificarAlerta(){
        // Obtener los valores ingresados por el usuario
        const idAlerta = document.getElementById('inputIdAlertaModificar').value.trim();
        const nuevoNivelAgua = document.getElementById('inputNuevoNivelAgua').value.trim();
        const nuevoEstado = document.getElementById('selectEstadoAlerta').value;
    
        // Crear el objeto de datos para enviar al backend
        const datosModificacion = {
            tabla: 'alertas',
            id: parseInt(idAlerta),
            nuevoTipo: parseFloat(nuevoNivelAgua),
            nuevaCantidad: nuevoEstado,
            nuevaFrecuencia:null
        };
    
        // Enviar datos al backend con fetch
        fetch('http://127.0.0.1:5000/encargado/actualizar', {
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
}

// Lógica para validar y modificar la alerta

