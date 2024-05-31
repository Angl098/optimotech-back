const {hashPassword}= require('..//utils/hashedPassword');
const { createUser, sendEmailController } = require('../controllers/userController');

const createUserHandler = async (req, res) => {
    const { name, sex, email, cellphone, address } = req.body;
    let {password} =  req.body;
    password = await hashPassword(password);
    try {
        const response = await createUser(name, sex, email, password, cellphone, address);
        res.status(200).json(response);
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
 

module.exports = { createUserHandler, sendEmail }