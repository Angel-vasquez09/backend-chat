

var mostrarUsuarios = document.querySelector("#mostrarUsuarios");
var mostrarPanel = document.querySelector("#mostrarPanel");

var abierto = false;

mostrarUsuarios.onclick = function(){

    if (!abierto) {
        mostrarPanel.style.left = '0';
        //console.log('Cerrado');
        abierto = true;
    }else{
        //console.log('Abierto');
        mostrarPanel.style.left = '-250px';
        abierto = false;
    }
};

function myFunction(x) {
    if (x.matches && !abierto) { // If media query matches
        mostrarPanel.style.left = '-250px';
        console.log('Cerrado');
        console.log(x.matches)
    } else {
        mostrarPanel.style.left = '0';
    }
  }
  
  var x = window.matchMedia("(max-width: 767px)");
  myFunction(x) // Call listener function at run time
  x.addListener(myFunction) // Attach listener function on state changes


