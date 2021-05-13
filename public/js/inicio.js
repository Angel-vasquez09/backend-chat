let sock  = null; // Socket
let user  = null; // Usuario autenticado
let usuariosR; // Usuarios registrados en la base de datos

var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/'
            : 'https://rest-server-09.herokuapp.com/';


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

    const resp = await fetch(`${url}auth/`, { 
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






    const PUBLIC_PUSH_KEY = "BJSbnxvcKTYWwErF8vvk6UFj3cXcFECsOJE78_XboD3GcC1GPglenWtdPWaW9HEwbN0RnA4tQ-pZtGGJVTtIN8k";
    // SUSCRIBIMOS AL USUARIO PARA PODER ENVIARLE NOTIFICACIONES

    /* Funcion para convertir la cadena base64 segura de URL en un 
     Uint8Array para pasar a la llamada de suscripción */
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
       
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
       
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

    /*Convertimos en  Uint8Array y guardamos en una variable */
    var push_key = urlBase64ToUint8Array(PUBLIC_PUSH_KEY);

    /*  */
    const register = await navigator.serviceWorker.register(`js/worker.js`,{
        scope: `../js/`
    })

    // Obtenemos la suscripcion del navegador en que nos encontremos
    const subsc = await register.pushManager.subscribe({
        userVisibleOnly     : true,
        applicationServerKey: push_key
    });

    /* Creamos un objeto en donde guardaremos la suscripcion del
    navegador en que estemos y tambien guardaremos el id
    del usuario autenticado en este navegador */
    let userSubscripcion = {id: user.id}

    let datosSubs = JSON.stringify(subsc);

    userSubscripcion['subcription'] = JSON.parse(datosSubs);
    
    // Guardar esa subscripcion en la base de datos
    const guardarSubscripcion = await fetch(`${url}pushSubscription/guardar-subscripcion`,{
        method: 'POST',
        body: JSON.stringify(userSubscripcion),
        headers: {'Content-Type': 'application/json'},
    });

    
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

    // Mostrar los mensajes no leidos al enviar un mensaje privado
    socket.on('count-mjs-priv', ({total,countM}) => {
        console.log('Holaaa: ',countM);
        ListaUser(total,countM);
    })


    socket.on('user-registrados', async(usuarios) => {

        usuariosRegistrados = usuarios;
        infoUser.innerHTML = `<a class="active animated fadeIn" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;
        
        socket.on('count-mjs', (payload) => {
            console.log('Dentro');
            ListaUser(usuarios,payload);
            return;
        });


        const countMjsUser = await fetch(`${url}countMensajes/${user.id}`);
        const {ok, count} = await countMjsUser.json();
        ListaUser(usuarios,count);
    });

    socket.on('conectado', (payload) => {
        console.log('usuario conectado')
        mensaje(payload,false);
    });

    
    socket.on('user-actualizado', async({usuario,usuarios}) => {
        nombreP.innerHTML =`<h1 class="text-capitalize animated fadeIn">${usuario.nombre} ${usuario.apellido}</h1>`;;
        infoUser.innerHTML = `<a class="active animated fadeIn" id="user-img"><img src="${usuario.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${usuario.nombre}</small></span></a>`;
        user = usuario;
        
        socket.on('count-mjs', (payload) => {
            ListaUser(usuarios,payload);
            mensaje(usuario,true);
            return;
        });

        const countMjsUser = await fetch(`${url}countMensajes/${user.id}`);
        const {ok, count} = await countMjsUser.json();

        ListaUser(usuarios,count);
        mensaje(usuario,true);
    })
    
    socket.on('desconectado', (payload) => {
        //socket.emit('count-mjs-para', user.id);
        mensaje(payload,false);
    });

    // socket para saber que el usuario no esta dentro de ningun chat
    socket.on('chat', () => {
        socket.emit('chat-inactivo', {de: user.id, para: user.id,chat: false})
    })
    

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
        $("#cabeceraT").html(`<img class="animated fadeIn" src='${payload.img}' style='${estilos}'  class="rounded me-2">`);
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
const ListaUser = (usuarios,payload) => {
    infoUser.innerHTML = `<a class="active animated fadeIn" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;
    var html = '';
    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        let conectado = 'desconectado'
        if (element.online) {
            conectado = 'conectado';
        }
        
        if (element.id !== user.id) {
            html += '<li id="chatPrivado" class="row animated fadeIn">';

            html += '   <div class="col-8 p-0">';
            for (let index = 0; index < payload.length; index++) {
                const countM = payload[index];
                if (countM.de === element.id) {
                    if (countM.cantidad !== 0) {
                        html += '   <div class="nuevo-mjs"><span>'+countM.cantidad+'</span></div>';
                    }
                }
            }
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

    const buscarAmigos = await fetch(`${url}buscar/usuarios/${texto}`);

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