const { login } = require('../controllers/login');
const {hashPassword, verifyPassword}= require('..//utils/hashedPassword');

const loginHandler = async (req, res) => {
    const { email } = req.body;
    let {password} =  req.body;
    console.log('llego gsd');
    //password = await hashPassword(password);
    try {
        const usuario = await login(email);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
          }
          //validar password
          const validate = await verifyPassword(password, usuario.password);
          if (!contraseñaValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
          }

    // Si el usuario y la contraseña son válidos, enviar una respuesta exitosa
    res.status(200).json({ mensaje: 'Autenticación exitosa' });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
}



module.exports = { loginHandler }