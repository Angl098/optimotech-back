const { loginController } = require('../controllers/loginController');
const { verifyPassword } = require('../utils/hashedPassword');

const loginHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginController(email);
        if (!user) {
            return res.status(200).json({ message: 'Usuario no encontrado. Regístrate' });
        }
        if (user.banned) {
            return res.status(200).json({ message: 'Usuario baneado. Contacta al administrador' });
        }
        // Validar password
        const validate = await verifyPassword(password, user.password);
        if (!validate) {
            return res.status(200).json({ message: 'Contraseña incorrecta' });
        }
        const { id, name, address, cellphone, sex, role } = user;
        const dataUser = { id, email, name, address, cellphone, sex, role };
        // Si el usuario y la contraseña son válidos, enviar una respuesta exitosa
        res.status(200).json({ message: 'Autenticación exitosa', dataUser });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { loginHandler };
