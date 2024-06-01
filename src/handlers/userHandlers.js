const { createUser } = require('../controllers/userController');
const {hashPassword}= require('..//utils/hashedPassword');

const { loginController } = require('../controllers/loginController');

const createUserHandler = async (req, res) => {
    const { name, sex, email, cellphone, address } = req.body;
    let {password} =  req.body;
    password = await hashPassword(password);
    try {
        //verificar que el email no se encuentre registrado
        const user = await loginController(email);
        console.log('email en la DB', user);
        if (user) {
            return res.status(200).json({ message: 'El Email ya esta registrado "Inicia sesion"´' });
          }

        await createUser(name, sex, email, password, cellphone, address);
        res.status(200).json({ message: 'Registro de usuario Exitoso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
}



module.exports = { createUserHandler }