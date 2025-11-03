document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const usuarioInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const btnIngresar = document.querySelector('button');
    const errorDiv = document.createElement('div');
    

    errorDiv.style.cssText = `
        color: #dc3545;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
        display: none;
        text-align: center;
    `;
    form.insertBefore(errorDiv, btnIngresar);
    

    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });
    

    btnIngresar.addEventListener('click', function(e) {
        e.preventDefault();
        realizarLogin();
    });
    

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            realizarLogin();
        }
    });
    
    function realizarLogin() {
        const usuario = usuarioInput.value.trim();
        const password = passwordInput.value;
        

        if (!usuario || !password) {
            mostrarError('Por favor completa todos los campos');
            return;
        }
        

        btnIngresar.disabled = true;
        btnIngresar.textContent = 'Ingresando...';
        ocultarError();
        

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                localStorage.setItem('admin_session', JSON.stringify({
                    usuario: data.usuario,
                    timestamp: new Date().getTime()
                }));
                

                window.location.href = 'menu.html';
            } else {
                mostrarError(data.mensaje || 'Error al iniciar sesión');
                btnIngresar.disabled = false;
                btnIngresar.textContent = 'Ingresar';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error de conexión con el servidor');
            btnIngresar.disabled = false;
            btnIngresar.textContent = 'Ingresar';
        });
    }
    
    function mostrarError(mensaje) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
        

        setTimeout(() => {
            ocultarError();
        }, 5000);
    }
    
    function ocultarError() {
        errorDiv.style.display = 'none';
    }
});
