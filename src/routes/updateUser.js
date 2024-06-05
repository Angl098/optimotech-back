const {Router} = require("express");

const updateUser = Router();

//Importar los handlers
const {updateUserHandler} = require("../handlers/updateUserHandler.js");

//Rutas
updateUser.post("/", updateUserHandler);

module.exports = updateUser;