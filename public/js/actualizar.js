/* socket = io({
    'extraHeaders': {
        'x-token': localStorage.getItem('token')
    }
}); */

var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8081/'
            : 'https://rest-server-09.herokuapp.com/';

const miForm = document.querySelector('form');
var nombreActualizar  = document.querySelector('#nombre');
var apellidoActualizar= document.querySelector('#apellido');
var previewActualizar = document.querySelector('#preview');
var idActualizar      = document.querySelector('#id');
var perfilImgActualizar= document.querySelector('#perfilImg');

var foto = {ok: false};

// Estilos del modal de actualizar
var snipperns  = document.querySelector('#snipperns');
var opModal    = document.querySelector('#opModal');

miForm.addEventListener('submit', async(ev) => {
    ev.preventDefault();
    
    var listo = true;
    
    if (nombre.value.length <= 6) {
        listo = false;
        nombre.style.border = '1px solid red'
    }else{
        nombre.style.border = '1px solid #1fc8df'
    }
    
    if (!listo) {
        return;
    }

    snipperns.classList.add("indez");
    opModal.classList.add("opacity");
    snipperns.classList.remove("mostrar");

    let data = {
        nombre  : nombreActualizar.value,
        apellido: apellidoActualizar.value,
        id      : idActualizar.value
    }

    if (foto.ok) {
        var formData = new FormData();
        formData.set('archivo',foto);

        const resp = await fetch(`${url}uploads/usuarios/${idActualizar.value}`,{
            method: 'PUT',
            body: formData
        });

        const img = await resp.json();

        if (img.ok) {
            
            perfilImgActualizar.innerHTML = `<img class="fotoPerfil" src="${img.modelo.img}" alt="user" />`;

            socket.emit('actualizar', data);

            snipperns.classList.remove("indez");
            opModal.classList.remove("opacity");
            snipperns.classList.add("mostrar");
            return;
        }
    }

    socket.emit('actualizar', data);
    
    snipperns.classList.remove("indez");
    snipperns.classList.add("mostrar");
    opModal.classList.remove("opacity");

})


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

}

const defaultBtn = document.querySelector("#file");
const customFile = document.querySelector("#custom-file");

function activarbtn(){
    defaultBtn.click();
}