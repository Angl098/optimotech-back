const { getUser } = require('../controllers/updateUserController');

const updateUserHandler = async (req, res) => {
    const {id, name, sex, email, cellphone, address} = req.body;
    try {
        const user = await getUser(id);
        if (user) {
     // Actualiza
      user.name = name;
      user.sex = sex;
      user.email = email;
      user.cellphone = cellphone;
      user.address = address;

      // Guarda los cambios en la base de datos
      await user.save();
      const dataUser = {id, email, name, address, cellphone, sex};
            return res.status(200).json({ message: 'Datos actualizados', dataUser });
          }else{
            res.status(200).json({ message: 'No se encontró ningún usuario con ese ID.' });
          }
    } catch (error) {
        console.error('Error al encontrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
}



module.exports = { updateUserHandler }