const miFormulario = document.querySelector('form');

const nombre   = document.querySelector('#nombre');
const apellido = document.querySelector('#apellido');
const correo   = document.querySelector('#correo');
const password = document.querySelector('#password');

// Estilos css
const divRegistro = document.querySelector('#divRegistro');
const snipperns   = document.querySelector('#snipperns');


var foto;

var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8081/'
            : 'https://rest-server-09.herokuapp.com/';




const mensaje = (validarC) => {
    var msj = '';
    $(document).ready(function(){

    if (validarC) {
        msj = 'El correo ya se encuantra registrado';
        $("#toast").css("background", "#8c001aab")
    }else{
        $("#toast").css("background", "#50f750ab");
        msj = 'Su registro fue exitoso';
        $('#nombre').text('');
        $('#correo').text('');
        $('#password').text('');
    }

    $('.toast').toast('show');
    $('#mensaje').text(msj);
    })
}

miFormulario.addEventListener('submit', async(ev) => {
    ev.preventDefault();

    var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    var listo = true;

    if (foto === undefined) {
        // Si no seleccionamos ninguna foto nos guardara
        // Una por defecto
        foto = 'https://res.cloudinary.com/dtqdqs5gb/image/upload/v1620103419/default_fyckbw.jpg';
    }

    if (nombre.value.length <= 6) {
        listo = false;
        nombre.style.border = '1px solid red';
    }else{
        nombre.style.border = '1px solid #1fc8df';
    }

    if (apellido.value.length <= 6) {
        listo = false;
        apellido.style.border = '1px solid red';
    }else{
        apellido.style.border = '1px solid #1fc8df';
    }
    
    if (correo.value.length === 0 || !regex.test(correo.value)) {
        correo.style.border = '1px solid red';
        listo = false;
    }

    // Validar que no exista un correo en la base de datos
    const invalidCorreo = await fetch(`${url}usuario/correo/${correo.value}`);
    const respuesta = await invalidCorreo.json();
    console.log(respuesta);
    if (!respuesta.ok) {
        mensaje(true);
        correo.style.border = '1px solid red';
        listo = false;
        return;
    }else{
        correo.style.border = '1px solid #1fc8df';
    }
    
    
    if (password.value.length === 0 || password.value.length <= 6) {
        password.style.border = '1px solid red';
        console.log('Password es obligatorio y con mas de 6 caracteres');
        listo = false;
    }else{
        password.style.border = '1px solid #1fc8df';
        
    }

    let Data = {
        nombre  : nombre.value,
        apellido: apellido.value,
        correo  : correo.value,
        password: password.value,
        rol     : 'USER_ROLE'
    };

    if (!foto.ok) {
      // Si tiene una foto por defecto creamos un nuevo atributo
      // donde estara la imagen
      Data['img']  = foto;
    }else{
        // si no la creamo pero la dejamos vaciaa
      Data['img']  = '';
    }


    if (!listo) {
        console.log('Todos los campos deben ser correctos');
        return;
    }

    snipperns.classList.remove("mostrar");
    divRegistro.style.opacity = '.3';
    
    /* Guardamos los datos del usuario en la base de datos
    con o sin la foto */
    const resp = await fetch(`${url}usuario/post`,{
        method: 'POST',
        body: JSON.stringify(Data),
        headers: {'Content-Type': 'application/json'},
    }); 
    
    const usuario = await resp.json();

    
    if(usuario){
        /* Si no selleccionamos una foto para nuestro perfil,
        no entrara a esta opcion */

        if (foto.ok) {

            /* Si entra a esta opcion significa que nosotros
            seleccionamos una foto para nuestro perfil y la guardara */
            var formData = new FormData();
            formData.set('archivo',foto);

            const resp = await fetch(`${url}uploads/usuarios/${usuario.usuario.id}`,{
                method: 'PUT',
                body: formData
            });
    
            const img = await resp.json();

            if (img) { 
                snipperns.classList.add("mostrar");
                divRegistro.style.opacity = '';
                nombre.value = '';
                correo.value = '';
                password.value = '';
                window.location = 'chat.html';
            }
            
        }

        snipperns.classList.add("mostrar");
        divRegistro.style.opacity = '';
        nombre.value = '';
        correo.value = '';
        password.value = '';
        window.location = 'chat.html';
    }
    
})


/* 
===================================================================
= ACTUALIZAR DATOS DEL USUARIO
===================================================================
*/





/* 
===================================================================
= ACTUALIZAR DATOS DEL USUARIO
===================================================================
*/





/* EVENTO PARA MOSTRAR LA IMAGEN ANTES DE GUARDARLA */
document.getElementById("file").onchange = function(e) {
    // Creamos el objeto de la clase FileReader
    let reader = new FileReader();
    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
    reader.readAsDataURL(e.target.files[0]);
    // Le decimos que cuando este listo ejecute el código interno
    reader.onload = function(){
        let preview = document.getElementById('preview'),
        image = document.createElement('img');
        image.src = reader.result;
        image.style.width  = '200px';
        image.style.height = '200px';
        image.style.objectFit = 'cover';
        image.style.borderRadius = '100%';
        preview.innerHTML = '';
        preview.append(image);
        preview.style.border = '0';
        
    };

    foto = e.target.files[0];
    foto['ok'] = true;
    //console.log(foto);
}

const defaultBtn = document.querySelector("#file");
const customFile = document.querySelector("#custom-file");

function activarbtn(){
    defaultBtn.click();
}




