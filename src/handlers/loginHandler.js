const { loginController } = require('../controllers/loginController');
const {verifyPassword}= require('../utils/hashedPassword');

const loginHandler = async (req, res) => {
    const {email, password } = req.body;
    try {
        const usuario = await loginController(email);
        if (!usuario) {
            return res.status(200).json({ message: 'Usuario no encontrado Registrate' });
          }
          //validar password
          const validate = await verifyPassword(password, usuario.password);
          if (!validate) {
            return res.status(200).json({ message: 'Contraseña incorrecta' });
          }

    // Si el usuario y la contraseña son válidos, enviar una respuesta exitosa
    res.status(200).json({ message: 'Autenticación exitosa' });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
}



module.exports = { loginHandler }
