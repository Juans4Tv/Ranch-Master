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
        case 'alertas':
            window.location.href = 'http://127.0.0.1:5000//encargado/alertas';
            break;
        case 'cerrar':
            window.location.href = 'http://127.0.0.1:5000//login';
            break;
        default:
            cargarResumen();
            break;
    }
}

// Función para cargar los datos del resumen general desde JSON o API
function cargarResumen() {
    fetch('http://127.0.0.1:5000//api/encargado') // Reemplaza con la URL correcta
        .then(response => response.json())
        .then(datosResumen => {
            const totalGanadoElem = document.getElementById('totalGanado');
            const totalAlimentacionElem = document.getElementById('totalAlimentacion');
            const totalAlertasElem = document.getElementById('totalAlertas');

            // Actualizar los valores de resumen, mostrando "N/A" si los datos están ausentes
            totalGanadoElem.textContent = datosResumen.ganado || 'N/A';
            totalAlimentacionElem.textContent = datosResumen.alimentacion || 'N/A';
            totalAlertasElem.textContent = datosResumen.alertas || 'N/A';
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
