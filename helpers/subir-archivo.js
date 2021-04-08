const path = require('path');
const { v4: uuidv4 } = require('uuid');
// v4: uuid4 = estamos renombrando la variable(v4) a uuid4

const subirArchivo = (files, extensionesPermitidas = ['png','jpg','jpeg','gif'] , carpeta = '') => {

    return new Promise( (resolve, reject) => {

         // Desestructuramos lo que venga en req.files
        const { archivo } = files;
        console.log(archivo)
        // separamos el nombre del archivo por puntos
        // nombreCortado sera una lista['nombre','png',]
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // VALIDAR EXTENSION
        if ( !extensionesPermitidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida`);
        }

        // RENOMBRAR EL NOMBRE DE LOS ARCHIVOS(IMAGENES QUE GUARDEMOS)
        const nombreTemporal = uuidv4() + '.' + extension;

        // Creamos la ruta en la que guardaremos nuestro archivo
        uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);
        

        // Guardamos nuestro archivo con la ruta que creamos
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemporal);
        });

    })
}


module.exports = {
    subirArchivo
}