const miFormulario = document.querySelector('form');

const correo   = document.querySelector('#correo');
const password = document.querySelector('#password');


var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/auth/'
            : 'https://rest-server-09.herokuapp.com/auth/';

// Estilos css
const divRegistro = document.querySelector('#divRegistro');
const snipperns   = document.querySelector('#snipperns');
let listo = true;





// Funcion para formulario de login
miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();

    var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if (correo.value.length === 0 || !regex.test(correo.value)) {
        listo = false;
        correo.style.border = '1px solid red';
    }
    
    if (password.value.length <= 6 ) {
        listo = false;
        password.style.border = '1px solid red';
    }

    if (!listo) {
        console.log('Todos los campos deben ser obligatorios')
        return;
    }

    snipperns.classList.remove("mostrar");
    divRegistro.style.opacity = '.3';

    const forData = {
        correo: correo.value,
        password: password.value
    };
    

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(forData),
        headers: {'Content-Type': 'application/json'},
    })
    .then(resp => resp.json())
    .then(({ msg, token }) => {

        if (msg) {
            // Si existe el msg es porque ocurrio un error
            // Mostramos el mensaje de error
            $(document).ready(function(){
                $('.toast').toast('show');
                $("#toast").css("background", "#8c001aab");
                $('#mensaje').text(msg);
            })
            correo.style.border = '1px solid red'; // border rojo
            password.style.border = '1px solid red'; // border rojo
            snipperns.classList.add("mostrar");
            divRegistro.style.opacity = '';
            return;
        }

        snipperns.classList.add("mostrar");
        divRegistro.style.opacity = '';

        // Si no existe el msg es porque todo esta bien
        // Podremos continuar
        localStorage.setItem('token',token);

        window.location = 'chat.html';
    })
    .catch(err => console.log(err))

})




function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    /* console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. */
    
    var id_token = googleUser.getAuthResponse().id_token;
    

    const data = { id_token };

    fetch(url + 'google', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(({ token }) => {
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch(err => console.log(err))


}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}