const {hashPassword}= require('..//utils/hashedPassword');
const { createUser, sendEmailController, getFilteredUserController, changePasswordController } = require('../controllers/userController');
const {  getAllUsers, banUser, unbanUser } = require('../controllers/userController');

const { loginController } = require('../controllers/loginController');

const createUserHandler = async (req, res) => {
    const { name, sex, email, cellphone, address } = req.body;
    let { password } = req.body;
    try {
        password = await hashPassword(password);
        //verificar que el email no se encuentre registrado
        let dataUser = await loginController(email);
        if (dataUser) {
            return res.status(200).json({ message: 'Usuario registrado "Inicia sesion..."', dataUser });
        }

        await createUser(name, sex, email, password, cellphone, address);
        dataUser = { name, sex, email, cellphone, address };
        res.status(200).json({ message: 'Usuario Registrado "Inicia sesion..."', dataUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
}



const sendEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const response = await sendEmailController(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
const getFilteredUsersHandler = async (req, res) => {

   
    try {
        const users = await getFilteredUserController(
            req.query
        );
        return res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}



const changePasswordHandler = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const response = await changePasswordController(email, newPassword);
        res.status(200).json(response);
    }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

const getAll = async (req, res) => {
    try {
        const response = await getAllUsers();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUserHandler,
    sendEmail,
    getFilteredUsersHandler,
    changePasswordHandler,
    createUserHandler, sendEmail, getAll ,banUserHandler,unBanUserHandler}




