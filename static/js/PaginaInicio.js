function showSpinner() {
    document.getElementById("spinner").style.display = "inline-block";
    setTimeout(() => {
        window.location.href = "{{url_for('login')}}";
    }, 2000); // Simula un retraso de 2 segundos antes de redirigir
}
