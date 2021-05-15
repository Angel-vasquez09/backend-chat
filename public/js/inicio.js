let tokenValido = null; // Token validado
let sock  = null; // Socket
let user  = null; // Usuario autenticado
let usuariosR; // Usuarios registrados en la base de datos
let datosUser; // Usuario al que le enviaremos los mensajes
var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/'
            : 'https://rest-server-09.herokuapp.com/';

// Mostrar chat al darle click
const perfil          = document.querySelector("#perfil");
const chat            = document.querySelector("#chat");
// Datos del usuario con el que chateamos
const imgUsuario      = document.querySelector("#imgUsuario");
const nombreUser      = document.querySelector("#nombreUser");
 

// Datos del usuario autenticado 
const divUsuarios     = document.querySelector("#divUsuarios");
const perfilImg       = document.querySelector("#perfilImg");
const nombreP         = document.querySelector("#nombreP");
const userAutenticado = document.querySelector("#userAutenticado");
const infoUser        = document.querySelector("#infoUser");

// Lista de usuarios conectados
const dataUser        = document.querySelector("#data-user");
// Icono para los usuarios conectados a desconectados
const conectDisconect = document.querySelector("#conect-disconect");
// Div circular de la cantidad de mensaje que tiene cada usuario
const countMjs        = document.querySelector("#count-mjs");

// Div donde se colocaran los mensajes
const divChatbox      = document.querySelector('#divChatbox') 

//FORMULARIO DE ACTUALIZAR
var nombreActualizar  = document.querySelector('#nombre');
var apellidoActualizar= document.querySelector('#apellido');
var previewActualizar = document.querySelector('#preview');
var idActualizar      = document.querySelector('#id');

/* 
===================================================================
=========================MOSTRAR CHAT==============================
==================================================================*/
// Mostramos el chat con el usuario que vayamos a chatear
listaUser = async(id = '') => {
    socket.emit('chat-activo',{de: id, para: user.id, chat: true });
    
    // Limpiamos el div de los mensajes antes de mostrarlos
    divChatbox.innerHTML = '';
    perfil.style.display = 'none';
    chat.style.display   = 'inline'

    const datosP = await fetch(`${url}usuario/${id}`, { 
        headers: { 'x-token': tokenValido }
    });

    // Metodo para obtener el usuario al que le enviaremos
    // el mensaje
    const datosD = await datosP.json()

    datosUser = datosD.usuario;
    
    imgUsuario.src       = datosUser.img;
    nombreUser.innerHTML = datosUser.nombre;
    
    const resp = await fetch(`${url}mensajes/${id}`, { 
        headers: { 'x-token':  tokenValido }
    });

    const mensajes = await resp.json();

    cargarChat(mensajes.mensajes);
    scrollMensajes(true);
    //cargarCountMjsUser();
}

infoUser.onclick = () => {
    perfil.style.display = 'inline';
    chat.style.display   = 'none'
}

/* 
===================================================================
==================FIN DE MOSTRAR CHAT==============================
===================================================================
 */








/* 
===================================================================
== CARGAR TODOS LOS MENSAJES MIOS Y CON EL USUARIO QUE CHATEO =====
===================================================================
 */

const cargarChat = (mensajes) => {

    if (mensajes.length === 0) {
        
        var welcome = `
            <div class="container welcome animated fadeIn">
                <h1 class="display-3 texto text-center">WELCOME</h1>
            </div>
            <h2 class="text-center mt-4 animated fadeIn">Mandale un saludo a ${datosUser.nombre}</h2>
            <h2 class="text-center mt-4 animated fadeIn"> ........................</h2>
            `;
        bienvenido.innerHTML = welcome;

    }
    
    for (let index = 0; index < mensajes.length; index++) {
        var mjs = '';
        const element = mensajes[index];
        if (element.de === user.id) {
            var date = new Date(element.createdAt);
            var hora = date.getHours() + ':' + date.getMinutes(); 
            mjs += '<li class="reverse animated fadeIn">';
            mjs +=     '<div class="chat-content">';
            mjs +=         '<div class="box bg-light-inverse">'+ element.mensaje +'</div>';
            mjs +=     '</div>';
            mjs +=     '<div class="chat-time">'+hora+'</div>';
            mjs += '</li>';
        }
        
        if (element.para === user.id) {
            var date = new Date(element.createdAt);
            var hora = date.getHours() + ':' + date.getMinutes(); 
            mjs += '<li class="animated fadeIn">';
            mjs +=      '<div class="chat-time">'+hora+'</div>';
            mjs +=         '<div class="chat-content">';
            mjs +=             '<div class="box bg-light-info">'+ element.mensaje +'</div>';
            mjs +=         '</div>';
            mjs += '</li>';
        }

        divChatbox.innerHTML += mjs;

        
    }

}
/* 
===================================================================
============================= FIN =================================
===================================================================
 */












/* 
===================================================================
=========================ENVIAR MENSAJE===========================
==================================================================*/

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
        para   : datosUser.id,
        mensaje: txtMensaje.value,
        hora   : hora
    });

    ListarMensajes(
        {
            mensaje : txtMensaje.value,
            hora    : hora
        }, true);

    txtMensaje.value = '';
    bienvenido.innerHTML = '';
    scrollMensajes(false);

    enviarNotificacion();
})
/* 
===================================================================
=========================FIN DE ENVIAR MENSAJE=====================
==================================================================*/









/* 
===================================================================
=========================SCROLL DE MENSAJES========================
===================================================================*/
const scrollMensajes = (cargar) => {

    $(document).ready(function(){
        if (cargar) {
            divChatbox.scrollTop = divChatbox.scrollHeight;
            return;
        }
        // selectors
        var newMessage       = $("#divChatbox li:last-child");
        
        // heights
        var clientHeight     = divChatbox.clientHeight;
        var scrollTop        = $('#divChatbox').scrollTop();
        var scrollHeight     = divChatbox.scrollHeight;
        var newMessageHeight = newMessage.innerHeight();
        var lastMessageHeight= newMessage.prev().innerHeight() || 0;
        
        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            divChatbox.scrollTop = scrollHeight;
        }
    });
}


/* 
===================================================================
=========================FIN DE SCROL DE MESAJE====================
===================================================================*/









/* 
===================================================================
======= ENVIAR NOTIFICACION DE MENSAJES A EL USUARIO PRIVADO ====
===================================================================
 */

const enviarNotificacion = async() => {

    /*Buscamos en la base de datos al usuario que queremos enviarle
    una notificacion */
    const obtenerUsuario = await fetch(`${url}pushSubscription/${datosUser.id}`);

    const userObtenido = await obtenerUsuario.json();

    if (userObtenido.ok) {
        /* Estraemos la suscripcion del navegador de el usuario
        al que le enviaremos la notify */
        const data = {
            title: `${datosUser.nombre}`,
            url: `${url}chat-privado.html?id=${user.id}`,
            message: `Tienes un nuevo mensaje de ${user.nombre}`,
            pushSubscription: userObtenido.verificarId.subcription
        }

        /* Gracias a la suscripcion que le estragimos al usuario
        podemos enviarle una notificacion al navegador en que 
        se encuentre subscrito */
        const newMessage = await fetch(`${url}webpush/new-message`,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        }); 
    }
    
}
/* 
===================================================================
======= ENVIAR NOTIFICACION DE MENSAJES A EL USUARIO PRIVADO ====
===================================================================
 */










/*
===================================================================
=========================LISTAR MENSAJE EN EL CHAT=================
==================================================================*/
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
====================FIN DE LISTAR MENSAJE EN EL CHAT===============
==================================================================*/









/* 
===================================================================
======= VALIDAR TOKEN PARA IDENTIFICAR EL USUARIO====
===================================================================
 */
const validarTkn = async() => {

    // Extraemos el token que tengamos en el navegador
    const token = localStorage.getItem('token') || '';
    tokenValido = token;
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
    socket.on('mensaje-privado', ({datos,yo}) => {
        ListarMensajes(datos,yo);
        //cargarCountMjsUser(users,countM);
    })

    


    socket.on('user-registrados', async(usuarios) => {

        usuariosRegistrados = usuarios;
        infoUser.innerHTML = `<a class="active animated fadeIn" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;
        
        cargarUser(usuarios);
        conectadoDesconectado(usuarios);
    });

    // Cantidad de mensajes que cada usuario tiene sin leer
    socket.on('count-mjs', ({users,countM}) => {
        cargarCountMjsUser(users,countM);
    })

    // Mensaje que se muestra a todos los usuarios cuando se conecta
    socket.on('conectado', ({user,users}) => {
        conectadoDesconectado(users);
        mensaje(user,false);
    });

    
    // Actualizamos los datos del usuario 
    socket.on('user-actualizado', async({user}) => {
        nombreP.innerHTML =`<h1 class="text-capitalize animated fadeIn">${user.nombre} ${user.apellido}</h1>`;;
        infoUser.innerHTML = `<a class="active animated fadeIn" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;
        mensaje(user,true);
    })

    socket.on('actualizado-user', ({usuarios}) => {
        cargarUser(usuarios);
    })

    /* Cuando el usuario entre a un chat, se colocara en cero
    los mensajes que no tenia leidos */
    socket.on('cargar-count', ({total,listo}) => {
        cargarCountMjsUser(total,listo);
    })
    
    socket.on('desconectado', ({user,users}) => {
        conectadoDesconectado(users);
        mensaje(user,false);
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
======= LISTAR USUARIOS REGISTRADOS - CONECTADO O DESCONECTADO ====
======= CANTIDAD DE MENSAJES NO LEIDOS                         ====
===================================================================
 */
const cargarUser = (usuarios) => {
    infoUser.innerHTML = `<a class="active animated fadeIn" id="user-img"><img src="${user.img}" alt="user-img" class="infoUser img-circle"><asmall class="text-success text-capitalize">${user.nombre}</small></span></a>`;
    var html = '';
    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        if (element.id !== user.id) {
            html += `
            <li class="animated fadeIn" onclick="listaUser('${element.id}')">
                <a class="text-decoration-none pt-3 pb-2 pr-0 pl-0">
                    <img src="${element.img}"  class="img-circle"> 
                    <small class="text-capitalize">${element.nombre}</small>
                </a>
            </li>
            `;
        }
    }

    dataUser.innerHTML = html;
}

const cargarCountMjsUser = (usuarios,countUser) => {
    
    var html = '';
    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        let encontrado = false;
        
        if (element.id !== user.id) {
            for (let index = 0; index < countUser.length; index++) {
                const countM = countUser[index];
                if (countM.de === element.id) {
                    encontrado = true;
                    if (countM.cantidad === 0) {
                        html += `
                            <li class="pt-3 pb-2 pr-0 pl-0 animated fadeIn">
                                <div style="width:30px !important;height: 30px;"></span></div>
                            </li>
                                `;
                    }else{
                                html += `
                                <li class="pt-3 pb-2 pr-0 pl-0 animated fadeIn">
                                <div class="circle"><span>${countM.cantidad}</span></div>
                                </li>
                                `;
                    }

                }
                        
            }

            if (!encontrado) {
                
                html += `
                <li class="pt-3 pb-2 pr-0 pl-0 animated fadeIn">
                    <div style="width:30px !important;height: 30px;"></span></div>
                </li>
                `;
            }else{
                encontrado = false;
                
            }
        }
    }
    
    countMjs.innerHTML = html;

}

const conectadoDesconectado = (usuarios) => {

    var html = '';
    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        let conectado = 'desconectado'
        if (element.online) {
            conectado = 'conectado';
        }

        if (element.id !== user.id) {
            html += `
                    <li class="pt-3 pb-2 pr-0 pl-0 animated fadeIn">
                        <div class="activo align-items-center">
                            <i class="fas fa-circle ${conectado}"></i>
                        </div>
                    </li>
                    `;
            
            
        }
    }

    conectDisconect.innerHTML = html;

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
        cargarUser(usuariosRegistrados);
        conectadoDesconectado(usuariosRegistrados);
        return;
    }
    let count;
    socket.emit('countMjs', 'buscar');

    socket.on('countMjs', (countM) => {
        count = countM;
        console.log(count);
    })

    const buscarAmigos = await fetch(`${url}buscar/usuarios/${texto}`);

    const amigos = await buscarAmigos.json();

    cargarUser(amigos.usuarios);
    conectadoDesconectado(amigos.usuarios);
    cargarCountMjsUser(amigos.usuarios,count);

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