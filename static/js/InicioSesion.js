let selectedRole = ""; // Variable para almacenar el rol seleccionado

// Función para seleccionar el rol y mostrar el campo de contraseña
function selectRole(role) {
    selectedRole = role; // Guarda el rol en la variable
    localStorage.setItem("userRole", role); // Guarda el rol en localStorage
    
    // Oculta los botones de rol y muestra el campo de contraseña
    document.getElementById("roleSelection").classList.add("d-none");
    document.getElementById("passwordSection").classList.remove("d-none");
}

//seletedRole recoje el rol


// Función para validar la contraseña y mostrar JSON
async function validatePassword() {


    const passwordInput = document.getElementById("passwordInput").value.toLowerCase();
    const errorMessage = document.getElementById("errorMessage");

    const userData = {
        role: selectedRole,
        password: passwordInput
    };
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (data[1].success === 'True') {
            console.log(data[0].message);

            // Redirige a una página específica según el rol
            if (selectedRole === "ganadero") {
                console.log('si esta entrando')
                window.location.href = "http://127.0.0.1:5000/ganadero";

            } else if (selectedRole === "encargado") {

                window.location.href = 'http://127.0.0.1:5000/encargado';                
            }
        } else {

            console.log("ya no entiendo");
            errorMessage.classList.remove("d-none"); // Muestra el mensaje de error si es incorrecta
        }


    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Fallo al conectar con la API. Por favor, inténtalo de nuevo más tarde.");
    }
}
// Función para regresar a la selección de rol
function goBack() {
    const roleSelection = document.getElementById("roleSelection");
    const passwordSection = document.getElementById("passwordSection");

    // Verifica si la sección de contraseña está visible
    if (!passwordSection.classList.contains("d-none")) {
        // Si está en la pantalla de contraseña, vuelve a la selección de rol
        roleSelection.classList.remove("d-none");
        passwordSection.classList.add("d-none");
        document.getElementById("errorMessage").classList.add("d-none");
        document.getElementById("passwordInput").value = ""; // Limpia el campo de contraseña
    } else {
        // Si ya está en la selección de rol, redirige a la página principal
        window.location.href = "http://127.0.0.1:5000/";
    }
}

// Hacer que la tecla Enter funcione en toda la página
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        if (!document.getElementById("passwordSection").classList.contains("d-none")) {
            validatePassword(); // Ejecuta la validación de la contraseña
        } else {
            selectRole("ganadero"); // Selecciona "ganadero" como rol por defecto
        }
    }
});