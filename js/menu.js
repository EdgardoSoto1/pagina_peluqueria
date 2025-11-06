document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
});

function cerrarSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('admin_session');
        sessionStorage.clear();
        window.location.href = '../index.html';
    }
}

function verificarAutenticacion() {
    const sesion = localStorage.getItem('admin_session');
    if (!sesion) {
        alert('Acceso no autorizado. Redirigiendo al login...');
        window.location.href = 'login.html';
    }
}
