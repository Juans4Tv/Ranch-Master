function mostrarSeccion(seccion) {
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
        case 'alertas':
            window.location.href = 'http://127.0.0.1:5000/ganadero/alertas';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000/login';
            break;
        default:
            cargarResumen();
            break;
    }
}

// Función para cargar los datos del resumen general desde JSON o API
function cargarResumen() {
    fetch('/ruta/a/tu/archivo/resumen.json') // Reemplaza con la URL correcta
        .then(response => response.json())
        .then(datosResumen => {
            const totalGanadoElem = document.getElementById('totalGanado');
            const totalAlimentacionElem = document.getElementById('totalAlimentacion');
            const totalAlertasElem = document.getElementById('totalAlertas');

            // Actualizar los valores de resumen, mostrando "N/A" si los datos están ausentes
            totalGanadoElem.textContent = datosResumen.totalGanado || 'N/A';
            totalAlimentacionElem.textContent = datosResumen.totalAlimentacion || 'N/A';
            totalAlertasElem.textContent = datosResumen.totalAlertas || 'N/A';
        })
        .catch(error => {
            console.error('Error al cargar los datos del resumen:', error);
            document.getElementById('totalGanado').textContent = 'N/A';
            document.getElementById('totalAlimentacion').textContent = 'N/A';
            document.getElementById('totalAlertas').textContent = 'N/A';
        });
}

// Llamar a la función cargarResumen al cargar la página
document.addEventListener('DOMContentLoaded', cargarResumen);
