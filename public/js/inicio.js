let sock  = null; // Socket
let user  = null; // Usuario autenticado
let usuariosR; // Usuarios registrados en la base de datos


const divUsuarios = document.querySelector("#divUsuarios");
const perfilImg   = document.querySelector("#perfilImg");
const nombreP     = document.querySelector("#nombreP");
const userAutenticado     = document.querySelector("#userAutenticado");
const infoUser     = document.querySelector("#infoUser");
//const correoP     = document.querySelector("#correoP");

//FORMULARIO DE ACTUALIZAR
var nombreActualizar  = document.querySelector('#nombre');
var apellidoActualizar= document.querySelector('#apellido');
var previewActualizar = document.querySelector('#preview');
var idActualizar      = document.querySelector('#id');

/* 
===================================================================
======= VALIDAR TOKEN PARA IDENTIFICAR EL USUARIO====
===================================================================
 */
const validarTkn = async() => {

    // Extraemos el token que tengamos en el navegador
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        // Redireccionamos si el token es incorrecto
        window.location = 'index.html';
        throw new Error('No existe un token en el servidor');
    }

    const resp = await fetch('http://localhost:8081/auth/', { 
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();

    // Renovamos el token
    localStorage.setItem('token', tokenDB);
    document.title = userDB.nombre;

    user = userDB;

    // Datos personales en la barra de usuarios registrado
    infoUser.innerHTML = `<a class="active" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;

    // Datos personales al ingresar al inicio
    perfilImg.innerHTML = `<img class="fotoPerfil" src="${user.img}" alt="user" />`;
    nombreP.innerHTML = `<h1 class="text-capitalize">${user.nombre} ${user.apellido}</h1>`;
    
    //correoP.innerHTML = `<strong>${user.correo}</strong>`;

    // Formulario de actualizar
    nombreActualizar.value = user.nombre;
    apellidoActualizar.value = user.apellido;
    idActualizar.value     = user.id;
    var estilo = 'width: 200px;height: 200px;object-fit: cover;border-radius: 100%'
    previewActualizar.innerHTML = `<img src="${user.img}" style= "${estilo}"/>`;
    previewActualizar.style.border = '0';
    previewActualizar.style.backgroundSize = 'cover';

    await conectarSocket();

    
}

/* 
===================================================================
======= FINDE VALIDAR TOKEN PARA IDENTIFICAR EL USUARIO====
===================================================================
 */







/* 
===================================================================
======= LLENAR FORMULARIO DE ACTUALIZACION  ====
===================================================================
/*


/* 
===================================================================
======= FIN DE LLENAR FORMULARIO DE ACTUALIZACION  ====
===================================================================
/* 




/* 
===================================================================
======= CONECTAR SOCKET PARA TRABAJAR EN TIEMPO REAL====
===================================================================
 */
const conectarSocket = async() =>{
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        socket.on('disconnect', () => {
            
        })
    });


    socket.on('user-registrados', (data) =>{
        /* Guardamos todos los usuarios registrados
        para despues utilizarlo en la busqueda de usuarios */
        usuariosRegistrados = data;
        // Listamos todos los usuarios registrados
        ListaUser(data);
        infoUser.innerHTML = `<a class="active" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;
        
    });

    socket.on('conectado', (payload) => {
        mensaje(payload,false);
    });

    
    socket.on('user-actualizado', ({usuario,usuarios}) => {
        nombreP.innerHTML =`<h1 class="text-capitalize">${usuario.nombre} ${usuario.apellido}</h1>`;;
        user = usuario;
        infoUser.innerHTML = `<a class="active" id="user-img"><img src="${usuario.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${usuario.nombre}</small></span></a>`;
        mensaje(usuario,true);
        ListaUser(usuarios);
    })
    
    socket.on('desconectado', (payload) => {
        mensaje(payload,false);
    });


    

}
/* 
===================================================================
======= FIN DE CONECTAR SOCKET PARA TRABAJAR EN TIEMPO REAL====
===================================================================
 */



/* 
===================================================================
======= MENSAJE DE CONECTADO Ó DESCONECTADO ====
===================================================================
 */

const mensaje = (payload,user_actu) => {
    $(document).ready(function(){
    
        var msj = '';
        

        if (user_actu) {
            $("#toast").css("background", "#50f750ab");
            msj = `${payload.nombre} se actualizo correctamente`;
        }else{

            if (payload.online) {
                $("#toast").css("background", "#50f750ab");
                msj = `${payload.nombre} se a conectado`
            }else{
                $("#toast").css("background", "#8c001aab")
                msj = `${payload.nombre} se a desconectado`
            }
        }
        
        $('.toast').toast('show');
        var estilos = 'width: 45px; height: 45px; object-fit: cover; border-radius: 100% !important;'
        $("#cabeceraT").html(`<img src='${payload.img}' style='${estilos}'  class="rounded me-2">`);
        $('#nombreToast').text(`${payload.nombre}`);
        $('#mensaje').text(msj);
    });

}

/* 
===================================================================
======= FIN DE MENSAJE DE CONECTADO Ó DESCONECTADO====
===================================================================
 */


/* 
===================================================================
======= LISTTAR USUARIOS CONECTADOS====
===================================================================
 */
const ListaUser = (usuarios) => {
    infoUser.innerHTML = `<a class="active" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;

    var html = '';
    
    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        let conectado = 'desconectado'
        if (element.online) {
            conectado = 'conectado';
        }
        
        if (element.id !== user.id) {
            html += '<li id="chatPrivado" class="row">';

            html += '   <div class="col-8 p-0">';
            html +=         '<a class="text-decoration-none pr-0" href="chat-privado.html?id='+element.id+'"><img src="'+element.img+'" alt="user-img" class="img-circle"> <span class="text-capitalize">'+ element.nombre +'</span></a>';
            html += '   </div>';

            html += '   <div class="col-4 dflex">';
            html += '       <i class="fas fa-circle ml-5 '+conectado+'"></i>';
            html += '   </div>';
            html += '</li>';
        }
        
    }

    divUsuarios.innerHTML = html;
}


/* 
===================================================================
======= FIN DE LISTTAR USUARIOS CONECTADOS====
===================================================================
 */




/* 
===================================================================
===================== BUSCAR AMIGOS =============================
===================================================================
 */

const input = document.querySelector('#input');

var texto = '';

input.oninput = async() => {

    texto = input.value;

    if (texto === '') {
        ListaUser(usuariosRegistrados);
        return;
    }

    const buscarAmigos = await fetch(`http://localhost:8081/buscar/usuarios/${texto}`);

    const amigos = await buscarAmigos.json();

    ListaUser(amigos.usuarios);

};


/* 
===================================================================
===================== FIN DE SCRIPT DE BUSCAR AMIGOS =====================
===================================================================
 */




const main = async() => {

    await validarTkn();

}


main();