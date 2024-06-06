const { hashPassword } = require('..//utils/hashedPassword');
const { createUser, sendEmailController, getAllUsers, banUser, unbanUser } = require('../controllers/userController');

const { loginController } = require('../controllers/loginController');

const createUserHandler = async (req, res) => {
    const { name, sex, email, cellphone, address } = req.body;
    let { password } = req.body;
    try {
        password = await hashPassword(password);

        // Verificar que el email no se encuentre registrado
        let dataUser = await loginController(email);
        if (dataUser) {
            return res.status(200).json({ message: 'Usuario registrado "Inicia sesion..."', dataUser });
        }

        // Crear el usuario
        await createUser(name, sex, email, password, cellphone, address);
        dataUser = { name, sex, email, cellphone, address };

        // Enviar el correo electrónico de confirmación
        const emailResponse = await sendEmailController(email, name, 'welcome');

        res.status(200).json({ message: 'Usuario Registrado "Inicia sesion..."', dataUser, emailResponse });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error(error);
    }
}


const banUserHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await banUser(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const unBanUserHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await unbanUser(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const response = await getAllUsers();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = { createUserHandler, getAll ,banUserHandler,unBanUserHandler}