function mostrarSeccion(seccion) {
    switch (seccion) {
        case 'alimentacion':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alimentacion';
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
            window.location.href = 'http://127.0.0.1:5000/ganadero/ganado';
            break;
    }
}
function volverAlMenu() {
    // Ocultar todos los contenedores primero
    ocultarTodosLosContenedores();

    // Obtener referencia al contenedor específico (ejemplo: contenedor de la tabla)
    const contenedorTabla = document.getElementById('contenedorTablaGanado');

    if (contenedorTabla && contenedorTabla.classList.contains("d-none")) {
        // Si la tabla está oculta, redirigir a la página principal
        window.location.href = "http://127.0.0.1:5000/ganadero";
    } else {
        // Si la tabla está visible, ocultarla
        if (contenedorTabla) {
            contenedorTabla.classList.add("d-none");
        }
    }
}


// Función para aceptar datos (puede ser expandida según el flujo)
function aceptarDatos() {
    alert("Datos aceptados correctamente.");
    // Aquí puedes agregar lógica para enviar datos al servidor o manejar acciones específicas
}

// Mostrar la sección de gestión de ganado
function mostrarSeccionGanado() {
    const sidebar = document.querySelector(".sidebar");
    const seccionGanado = document.querySelector("#ganado");

    // Ocultar el menú y mostrar la sección
    sidebar.style.display = "none";
    seccionGanado.classList.remove("d-none");
}

function ocultarTodosLosContenedores() {
    // Selecciona todos los contenedores que deseas ocultar
    const contenedores = [
        document.getElementById('registroGanadoContainer'),
        document.getElementById('contenedorTablaGanado'),
        document.getElementById('alimentacion'), // Incluyendo más contenedores
        document.getElementById('eliminarGanadoContainer'), // Si existe este contenedor para eliminar ganado
        document.getElementById('modificarGanadoContainer') // Agrega otros contenedores según sea necesario
    ];

    // Itera sobre cada contenedor y ocúltalo si existe
    contenedores.forEach(contenedor => {
        if (contenedor) {
            contenedor.style.display = 'none';
        }
    });
}



function registrarGanado() {
    // Mostrar el contenedor de registro de ganado
    const contenedorRegistro = document.getElementById('registroGanadoContainer');
    contenedorRegistro.style.display = 'block';

    // Obtener referencia del botón de guardar y asignar la función de guardar
    const btnGuardar = document.getElementById('btnGuardarGanado');
    btnGuardar.onclick = function () {
        // Obtener valores de los inputs
        const raza = document.getElementById('razaGanado').value.trim();
        const edad = document.getElementById('edadGanado').value.trim();
        const peso = document.getElementById('pesoGanado').value.trim();
        const estadoSalud = document.getElementById('estadoSalud').value.trim();

        // Validación básica de los campos
        if (!raza || !edad || isNaN(edad) || !peso || isNaN(peso) || !estadoSalud) {
            alert('Por favor, complete todos los campos con valores válidos.');
            return;
        }

        // Crear el objeto de datos para enviar al servidor
        const ganadoData = {
            tabla:'ganado',
            tipo: raza,
            cantidad: parseInt(edad, 10),
            frecuencia: parseFloat(peso),
            fecha: estadoSalud,
            id_usuario: 1
        };

        // Enviar los datos al servidor utilizando fetch y JSON
        fetch('http://127.0.0.1:5000/ganadero/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ganadoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Ganado registrado exitosamente.');
                // Limpiar los inputs después de registrar
                document.getElementById('razaGanado').value = '';
                document.getElementById('edadGanado').value = '';
                document.getElementById('pesoGanado').value = '';
                document.getElementById('estadoSalud').value = '';
                // Ocultar el contenedor si es necesario
                contenedorRegistro.style.display = 'none';
            } else {
                alert('Error al registrar el ganado. Por favor, intente nuevamente.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al registrar el ganado.');
        });
    };
}

function consultarGanado() {
    const tablaGanado = document.querySelector("#tablaGanado tbody");
    const contenedorTabla = document.querySelector("#contenedorTablaGanado");

    // Ocultar tabla antes de llenarla si es necesario
    if (contenedorTabla) {
        contenedorTabla.classList.add("d-none");
    }
    const ganadoData={
        name:'ganado'
    }
    // Solicitud de datos de ganado desde JSON o API
    fetch('http://127.0.0.1:5000/ganadero/consultas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ganadoData)
    })
        .then(response => response.json())
        .then(datosGanado => {
            // Limpiar el contenido de la tabla antes de llenarla
            tablaGanado.innerHTML = "";

            // Verificar si hay datos en la respuesta
            if (datosGanado.length === 0) {
                const filaVacia = document.createElement("tr");
                filaVacia.innerHTML = `
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                `;
                tablaGanado.appendChild(filaVacia);
            } else {
                datosGanado.forEach((ganado) => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${ganado.raza}</td>
                        <td>${ganado.edad}</td>
                        <td>${ganado.peso}</td>
                        <td>${ganado.estado}</td>
                        <td>${ganado.id_ganado}</td>
                    `;
                    tablaGanado.appendChild(fila);
                });
            }

            // Mostrar la tabla después de llenarla
            if (contenedorTabla) {
                contenedorTabla.classList.remove("d-none");
                contenedorTabla.style.display = "block"; // Asegura su visibilidad
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos de ganado:', error);
            tablaGanado.innerHTML = ""; // Limpiar cualquier dato previo

            // Si ocurre un error, mostrar una fila con "N/A" en cada celda
            const filaVacia = document.createElement("tr");
            filaVacia.innerHTML = `
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
            `;
            tablaGanado.appendChild(filaVacia);
            if (contenedorTabla) {
                contenedorTabla.classList.remove("d-none");
                contenedorTabla.style.display = "block"; // Asegura su visibilidad
            }
        });
}


function modificarGanado() {
    // Obtener referencia al contenedor
    const contenedorModificar = document.getElementById('modificarGanadoContainer');
    contenedorModificar.style.display = 'block';

    // Obtener referencia al botón de buscar y asignar función de búsqueda
    document.getElementById('btnBuscarGanado').onclick = function () {
        const idGanado = document.getElementById('idGanado').value.trim();

        if (!idGanado) {
            alert('Por favor, ingrese un ID válido.');
            return;
        }
        const data={
            id:idGanado
        }
        // Llamada para buscar el ganado en la base de datos mediante el ID
        fetch('http://127.0.0.1:5000/ganadero/actualizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.success) {
                    // Mostrar inputs para modificar datos si se encuentra el ganado
                    document.getElementById('filaModificarRaza').style.display = '';
                    document.getElementById('filaModificarEdad').style.display = '';
                    document.getElementById('filaModificarPeso').style.display = '';
                    document.getElementById('filaModificarEstado').style.display = '';
                    document.getElementById('filaGuardarCambios').style.display = '';

                    // Llenar los inputs con la información actual del ganado
                    document.getElementById('modificarRazaGanado').value = data.raza || '';
                    document.getElementById('modificarEdadGanado').value = data.edad || '';
                    document.getElementById('modificarPesoGanado').value = data.peso || '';
                    document.getElementById('modificarEstadoSalud').value = data.estadoSalud || '';
                } else {
                    alert('Ganado no encontrado con el ID proporcionado.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al buscar el ganado.');
            });
    };

    // Guardar cambios
    document.getElementById('btnGuardarCambiosGanado').onclick = function () {
        const idGanado = document.getElementById('idGanado').value.trim();
        const raza = document.getElementById('modificarRazaGanado').value.trim();
        const edad = document.getElementById('modificarEdadGanado').value.trim();
        const peso = document.getElementById('modificarPesoGanado').value.trim();
        const estadoSalud = document.getElementById('modificarEstadoSalud').value.trim();

        // Crear objeto con datos a actualizar (solo enviar valores si están presentes)
        const datosModificados = {};
        datosModificados.tabla='ganado'
        datosModificados.id=idGanado
        if (raza) datosModificados.nuevoTipo = raza;
        if (edad) datosModificados.nuevaCantidad = parseInt(edad, 10);
        if (peso) datosModificados.nuevaFrecuencia = parseFloat(peso);
        if (estadoSalud) datosModificados.estadoser = estadoSalud;


        // Enviar datos modificados al servidor
        fetch('http://127.0.0.1:5000/ganadero/actualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosModificados)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Datos del ganado actualizados exitosamente.');
                // Opcional: ocultar campos o realizar otra acción
            } else {
                alert('Error al actualizar los datos del ganado.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al actualizar los datos del ganado.');
        });
    };
}

// Función para eliminar ganado
function eliminarGanado() {
    // Ocultar todos los contenedores y mostrar el de eliminar
    ocultarTodosLosContenedores();
    const contenedorEliminar = document.getElementById('eliminarGanadoContainer');
    if (contenedorEliminar) {
        contenedorEliminar.style.display = 'block';
    }

    // Obtener referencia al botón de confirmación
    const btnConfirmar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmar) {
        // Evitar acumulación de eventos eliminando cualquier listener previo
        btnConfirmar.onclick = null;

        // Asignar nuevo evento
        btnConfirmar.onclick = function () {
            const idGanado = document.getElementById('idGanadoEliminar').value.trim();

            if (!idGanado) {
                alert('Por favor, ingrese un ID válido.');
                return;
            }

            if (confirm('¿Está seguro de que desea eliminar el ganado con ID ' + idGanado + '?, ¡Con esto tabmien eliminara la vinculacion de alimentacion!')) {
                // Simular eliminación con fetch
                const data={
                    tabla:'ganado',
                    id: parseInt(idGanado)
                }

                fetch('http://127.0.0.1:5000/ganadero/eliminar', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Ganado eliminado exitosamente.');
                        document.getElementById('idGanadoEliminar').value = '';
                        contenedorEliminar.style.display = 'none'; // Ocultar después de eliminar
                    } else {
                        alert('Error al eliminar el ganado. Por favor, intente nuevamente.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Ocurrió un error al intentar eliminar el ganado.');
                });
            }
        };
    }
}

// Función para ocultar todos los contenedores
function ocultarTodosLosContenedores() {
    const contenedores = document.querySelectorAll(
        '#registroGanadoContainer, #contenedorTablaGanado, #modificarGanadoContainer, #eliminarGanadoContainer'
    );
    contenedores.forEach(contenedor => {
        contenedor.style.display = 'none';
    });
}

// Función para volver al menú
function volverAlMenu() {
    ocultarTodosLosContenedores(); // Asegurar que todo esté oculto
    // Si hay un paso adicional que necesite volver al menú principal, colócalo aquí.
}
