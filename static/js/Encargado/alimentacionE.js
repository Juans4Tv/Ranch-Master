
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
            window.location.href = 'http://127.0.0.1:5000//encargado/ganado';
            break;
        case 'vinculacion':
            window.location.href = 'http://127.0.0.1:5000//encargado/alimentaciongrupo';
            break;
        case 'alertas':
            window.location.href = 'http://127.0.0.1:5000//encargado/alertas';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000//login';
            break;
        default:
            window.location.href = 'http://127.0.0.1:5000//encargado/alimentacion';
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
    
    const tipoAlimento = document.getElementById('tipoAlimento').value;
    const cantidadAlimento = document.getElementById('cantidadAlimento').value;
    const frecuenciaAlimento = document.getElementById('frecuenciaAlimento').value;

    console.log(fechaHoraFormateada); // Imprime la fecha y hora en el formato YYYY-MM-DD HH:MM:SS

    if (tipoAlimento && cantidadAlimento && frecuenciaAlimento) {
        const nuevoRegistro = {
            tabla: 'alimentacion',
            tipo: tipoAlimento,
            cantidad: parseInt(cantidadAlimento),
            fecha: fechaHoraFormateada,  // Usar la fecha con hora
            frecuencia: frecuenciaAlimento,
            id_usuario: 2
        };

        // Realizar la solicitud POST al backend
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
async function consultarRegistrosAlimentacion() {
    try {
        const userData = { name: 'alimentacion' };
        const response = await fetch('http://127.0.0.1:5000/encargado/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();

        tablaAlimentacion.innerHTML = ''; // Limpiar la tabla
        if (data.length === 0) {
            mensajeNoEncontradoAlimentacion.style.display = 'block';
            return;
        }

        mensajeNoEncontradoAlimentacion.style.display = 'none';

        data.forEach(registro => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${registro.id_alimentacion || 'N/A'}</td>
                <td>${registro.tipo_alimento || 'N/A'}</td>
                <td>${registro.cantidad || 'N/A'}</td>
                <td>${registro.frecuencia || 'N/A'}</td>
                <td>${registro.fecha_registro || 'N/A'}</td>
            `;
            tablaAlimentacion.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al consultar los registros:', error);
        mensajeNoEncontradoAlimentacion.style.display = 'block';
    }
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
        tabla: 'alimentacion',
        id: idModificar,
        nuevoTipo: nuevoTipo || null,
        nuevaCantidad: nuevaCantidad ? parseInt(nuevaCantidad) : null,
        nuevaFrecuencia: nuevaFrecuencia || null
    };

    // Petición simulada al backend para modificar un alimento
    fetch('http://127.0.0.1:5000/encargado/actualizar', {
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

// Función para volver al menú
function volverAlMenu() {
    const alimentacionInputs = document.querySelector("#alimentacionInputs");
    const contenedorTablaAlimentacion = document.querySelector("#contenedorTablaAlimentacion");
    const modificarAlimentacionContainer = document.querySelector("#modificarAlimentacionContainer");

    // Verifica si algún contenedor está visible
    if (alimentacionInputs.style.display === "none" &&
        contenedorTablaAlimentacion.style.display === "none" &&
        modificarAlimentacionContainer.style.display === "none") {
        // Redirige a Encargado.html si no hay contenedores visibles
        window.location.href = "http://127.0.0.1:5000/encargado";
    } else {
        // Oculta todos los contenedores visibles
        alimentacionInputs.style.display = "none";
        contenedorTablaAlimentacion.style.display = "none";
        modificarAlimentacionContainer.style.display = "none";
    }
}

