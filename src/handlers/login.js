const { login } = require('../controllers/login');
const {  verifyPassword } = require('../utils/hashedPassword');

const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await login(email);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Validar contraseña
        const validate = await verifyPassword(password, usuario.password);
        if (!validate) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Si el usuario y la contraseña son válidos, enviar una respuesta exitosa
        return res.status(200).json({ mensaje: 'Autenticación exitosa' });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}

module.exports = { loginHandler }
