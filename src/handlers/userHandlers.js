const { createUser } = require('../controllers/userController');
const {hashPassword}= require('..//utils/hashedPassword');

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



module.exports = { createUserHandler }