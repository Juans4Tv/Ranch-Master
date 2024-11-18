function mostrarSeccion(seccion) {
    switch (seccion) {
        case 'alimentacion':
            window.location.href = 'http://127.0.0.1:5000//encargado/alimentacion';
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
            window.location.href = 'http://127.0.0.1:5000//encargado/ganado';
            break;
    }
}

async function consultarGanado() {
    const tablaGanado = document.querySelector("#tablaGanado tbody");
    const contenedorTabla = document.querySelector("#contenedorTablaGanado");

    // Ocultar tabla antes de llenarla
    contenedorTabla.classList.add("d-none");

    const userData = { name: 'ganado' };

    try {
        // Realiza la solicitud de datos de ganado
        const response = await fetch('http://127.0.0.1:5000/encargado/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        const datosGanado = await response.json();
        console.log(datosGanado);

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
                    <td>${ganado.id_usuario}</td>
                `;
                tablaGanado.appendChild(fila);
            });
        }

        // Mostrar la tabla después de llenarla
        contenedorTabla.classList.remove("d-none");
    } catch (error) {
        console.error('Error al cargar los datos de ganado:', error);
        tablaGanado.innerHTML = ""; // Limpiar cualquier dato previo

        // Mostrar una fila con "N/A" en caso de error
        const filaVacia = document.createElement("tr");
        filaVacia.innerHTML = `
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
        `;
        tablaGanado.appendChild(filaVacia);
        contenedorTabla.classList.remove("d-none");
    }
}


// Función para volver al menú
function volverAlMenu() {
    const contenedorTabla = document.querySelector("#contenedorTablaGanado");
    
    if (contenedorTabla.classList.contains("d-none")) {
        // Si la tabla está cerrada, redirigir a Encargado.html
        window.location.href = "http://127.0.0.1:5000/encargado";
    } else {
        // Si la tabla está abierta, ocultarla
        contenedorTabla.classList.add("d-none");
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
