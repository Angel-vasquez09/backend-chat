var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/'
            : 'https://rest-server-09.herokuapp.com/';

var params = new URLSearchParams(window.location.search);
var para = '';

if (params.get('id')) {
    para = params.get('id');
}


let usuario = null; // Datos del usuario que enviara los mensajes
let datosUsuario = null; // Datos del usuario que recibira los mensajes
let socket  = null;
let usuariosRegistrados;
var nom = 'Chat General'; // Nombre con quien hablara en el chat

//Referencias de javascripts
const divUsuarios = document.querySelector('#divUsuarios');
const formEnviar  = document.querySelector('#formEnviar');
const txtMensaje  = document.querySelector('#txtMensaje');
const divChatbox  = document.querySelector('#divChatbox');
const chatPrivado = document.querySelector('#chatPrivado');
const nombreUser  = document.querySelector('#nombreUser');
const imgUsuario  = document.querySelector('#imgUsuario');
const bienvenido  = document.querySelector('#bienvenido');

var infoUser      = document.querySelector("#infoUser");

/* 
===================================================================
======= VALIDAR TOKEN PARA QUE EL USUARIO PUEDE ESTAR EN ESTE CHAT ====
===================================================================
 */
const validarTkn = async() => {

    // Extraemos el token que tengamos en el navegador
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        // Redireccionamos si el token es incorrecto
        window.location = 'index.html';
        console.log('Error en el tokend')
        throw new Error('No existe un token en el servidor');
    }

    const resp = await fetch(`${url}auth/`, { 
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();

    // Renovamos el token
    localStorage.setItem('token', tokenDB);
    document.title = userDB.nombre;

    usuario = userDB;

    infoUser.innerHTML = `<a class="active" id="user-img"><img src="${usuario.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${usuario.nombre}</small></span></a>`;

    await conectarSocket();

    if (para != '') {

        const datosP = await fetch(`${url}usuario/${para}`, { 
            headers: { 'x-token': token }
        });

        // Metodo para obtener el usuario al que le enviaremos
        // el mensaje
        const datosD = await datosP.json()

        datosUsuario = datosD.usuario;


        const resp = await fetch(`${url}mensajes/${para}`, { 
            headers: { 'x-token': token }
        });

        const mensajes = await resp.json()

        cargarChat(mensajes.mensajes);
        // Colocar el scrool al final del chat cuando se carguen los mensjaes
        scrollMensajes(true);
    }
}

/* 
===================================================================
======= FIN DE VALIDAR TOKEN ====
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




/* 
===================================================================
======= MOSTRAR LOS MENSAJES DE LA BASE DE DATOS ====
===================================================================
 */

const cargarChat = (mensajes) => {

    
    if (mensajes.length === 0) {
        
        var welcome = `
            <div class="container welcome animated fadeIn">
                <h1 class="display-3 texto text-center">WELCOME</h1>
            </div>
            <h2 class="text-center mt-4 animated fadeIn">Mandale un saludo a ${datosUsuario.nombre}</h2>
            <h2 class="text-center mt-4 animated fadeIn"> ........................</h2>
            `;
        bienvenido.innerHTML = welcome;

    }
    
    for (let index = 0; index < mensajes.length; index++) {
        var html = '';
        const element = mensajes[index];
        if (element.de === usuario.id) {
            var date = new Date(element.createdAt);
            var hora = date.getHours() + ':' + date.getMinutes(); 
            html += '<li class="reverse animated fadeIn">';
            html +=     '<div class="chat-content">';
            html +=         '<div class="box bg-light-inverse">'+ element.mensaje +'</div>';
            html +=     '</div>';
            html +=     '<div class="chat-time">'+hora+'</div>';
            html += '</li>';
        }
        
        if (element.para === usuario.id) {
            var date = new Date(element.createdAt);
            var hora = date.getHours() + ':' + date.getMinutes(); 
            html += '<li class="animated fadeIn">';
            html +=      '<div class="chat-time">'+hora+'</div>';
            html +=         '<div class="chat-content">';
            html +=             '<div class="box bg-light-info">'+ element.mensaje +'</div>';
            html +=         '</div>';
            html += '</li>';
        }


        divChatbox.innerHTML += html;
        
    }

}
/* 
===================================================================
======= FIN DE MOSTRAR LOS MENSAJES DE LA BASE DE DATOS ====
===================================================================
 */




/* 
===================================================================
======= CONECTAR SOCKET ====
===================================================================
 */

const conectarSocket = async() =>{
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('count-mjs-priv', ({total,countM}) => {
        console.log('Holaaa: ',countM);
        ListaUser(total,countM);
    })


    socket.on('connect', () => {
        socket.on('user-registrados', (data) =>{
            /* Guardamos todos los usuarios registrados
            para despues utilizarlo en la busqueda de usuarios */
            usuariosRegistrados = data;
            socket.on('count-mjs', (payload) => {
                ListaUser(data,payload);
            });
        });
        
    });

    socket.on('conectado', (payload) => {
        mensaje(payload);
    });
    
    socket.on('desconectado', (payload) => {
        mensaje(payload);
    });

    socket.on('disconnect', () => {
        
    })

    socket.on('mensaje-privado', ({datos, yo}) => {
        ListarMensajes(datos,yo);
        
    });

    /* Actualizar el usuario para saber en que chat se encuentra */
    socket.on('chat', (resp) => {
        socket.emit('chat-activo', {de: usuario.id,para: para,chat: true});
    });


}
/* 
===================================================================
======= FIN DE CONECTAR SOCKET ====
===================================================================
 */




/* 
===================================================================
======= MENSAJE DE CONECTADO Ó DESCONECTADO ====
===================================================================
 */

const mensaje = (payload) => {
    $(document).ready(function(){
    
        var msj = '';

        if (payload.online) {
            $("#toast").css("background", "#50f750ab");
            msj = `${payload.nombre} se a conectado`
        }else{
            $("#toast").css("background", "#8c001aab")
            msj = `${payload.nombre} se a desconectado`
        }
        
        $('.toast').toast('show');
        var estilos = 'width: 45px; height: 45px; object-fit: cover; border-radius: 100% !important;';
        
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
======= LISTADO DE USUARIOS CONECTADOS ====
===================================================================
 */


const ListaUser = (usuarios,payload) => {

    var html = '';
    
    var img = 'assets/images/users/5.jpg';
    for (let index = 0; index < usuarios.length; index++) {
        if (usuarios[index].id === para) {
            nom = usuarios[index].nombre;
            imgUsuario.src = usuarios[index].img;
        }
    }

    nombreUser.innerHTML = nom; 

        if (para != '') {
            html += '<li class="animated fadeIn">';
            html +=    '<a class="text-decoration-none" href="chat.html" class="active">Regresar Chat General</span></a>';
            html += '</li>';    
        }
        
    
    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        let conectado = 'desconectado'
        if (element.online) {
            conectado = 'conectado';
        }
        
        if (element.id !== usuario.id) {
            html += '<li id="chatPrivado" class="row animated fadeIn">';

            html += '   <div class="col-8 p-0">';
            for (let index = 0; index < payload.length; index++) {
                const countM = payload[index];
                if (countM.de !== para) {   
                    if (countM.de === element.id) {
                        if (countM.cantidad !== 0) {
                            html += '<div class="nuevo-mjs"><span>'+countM.cantidad+'</span></div>';
                        }
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
======= FIN DE LISTADO DE USUARIOS CONECTADOS ====
===================================================================
 */




/* const  scrollBottom  = () => {
    $(document).ready(function(){
        // selectors
        var newMessage = divChatbox.children[divChatbox.children.length - 1];
        
        // heights
        var clientHeight      = divChatbox.prop('clientHeight');
        var scrollTop         = divChatbox.prop('scrollTop');
        var scrollHeight      = divChatbox.prop('scrollHeight');
        var newMessageHeight  = newMessage.innerHeight();
        var lastMessageHeight = newMessage.prev().innerHeight() || 0;

        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            divChatbox.scrollTop(scrollHeight);
        }
    })
} */



const scrollMensajes = (ultimoMensaje) => {
    var clientHeight     = divChatbox.clientHeight;
    var scrolTop         = divChatbox.scrollTop;
    var scrolhei         = divChatbox.scrollHeight;
    var newMessageHeight = divChatbox.children[divChatbox.children.length - 1].offsetHeight || 0;
    var lastMessageHeight= divChatbox.children[divChatbox.children.length - 2].offsetHeight || 0;

    if (ultimoMensaje) {
        divChatbox.scrollTop = divChatbox.scrollHeight;
        return;
    }

    if ((clientHeight + scrolTop + newMessageHeight + lastMessageHeight) >= scrolhei) {
        // El scroll no se ira hacia bajo si el scroll esta en los mensajes de arribaa
        // Sola baja el scroll cuando me encuentro en el ultimo mensaje
        divChatbox.scrollTop = divChatbox.scrollHeight;
    }
}
    





/* 
===================================================================
======= LISTAR MENSAJES AL ENVIARLOS AL USUARIO ====
===================================================================
 */

const ListarMensajes = (datos,yo) => {
    
    var html = '';
    if (yo) {
        // Si el mensaje lo envio yo, se mostrara este
        html += '<li class="reverse animated fadeIn">';
        html +=     '<div class="chat-content">';
        //html +=         '<h5>'+ datos.nombre +'</h5>';
        html +=         '<div class="box bg-light-inverse">'+ datos.mensaje +'</div>';
        html +=     '</div>';
/*         html +=     '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
 */     html +=     '<div class="chat-time">'+datos.hora+'</div>';
        html += '</li>';

    }else{
        // Este mensaje lo resive la otra persona
        html += '<li class="animated fadeIn">';
        html +=      '<div class="chat-time">'+datos.hora+'</div>';
/*         html +=     '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
 */     html +=         '<div class="chat-content">';
        //html +=             '<h5>'+ datos.nombre +'</h5>';
        html +=             '<div class="box bg-light-info">'+ datos.mensaje +'</div>';
        html +=         '</div>';
        html += '</li>';
    }

    divChatbox.innerHTML += html;
}
/* 
===================================================================
======= FIN DE LISTAR MENSAJES AL ENVIARLOS AL USUARIO ====
===================================================================
 */







/* 
===================================================================
======= ENVIAR MENSAJEEE ====
===================================================================
 */
formEnviar.addEventListener('submit', (e) => {
    // Evita que se recargue la pagina cuando le damos a el boton
    e.preventDefault();

    // El trim() elimina los espacios vacios
    // La condicion no te deja seguir si no mandas ningun texto
    if (txtMensaje.value.trim().length === 0) {
        return;
    }

    var fecha = new Date();
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    
    socket.emit('enviar-mensaje', {
        para   : para,
        mensaje: txtMensaje.value,
        hora   : hora
    });

    
    
    
    ListarMensajes(
        {
            nombre  : usuario.nombre, 
            mensaje : txtMensaje.value,
            hora    : hora
        }, true);

    txtMensaje.value = '';
    bienvenido.innerHTML = '';
   
    scrollMensajes(false);
})

/* 
===================================================================
======= FIN DE LISTAR MENSAJES AL ENVIARLOS AL USUARIO ====
===================================================================
 */







const main = async() => {

    await validarTkn();

}


main();
