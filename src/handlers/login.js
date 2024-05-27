const { login } = require('../controllers/login');
const { verifyPassword } = require('../utils/hashedPassword');

const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await login(email);
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Validate password
        const validate = await verifyPassword(password, user.password);
        if (!validate) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Successful authentication, return only the user ID
        return res.status(200).json({ userId: user.id });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { loginHandler };
