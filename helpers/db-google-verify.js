const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerifu = async(id_token = '') => { 

  const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,  
  }); 

  const { 
        email: correo,
        name: nombre,
        picture: img
        } = ticket.getPayload();
  
  return {correo, nombre, img};
}



module.exports = {
    googleVerifu
}