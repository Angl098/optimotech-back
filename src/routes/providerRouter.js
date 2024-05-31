const {Router} = require("express");
const { createProviderHandler, getProviderHandler, updateProviderHandler } = require("../handlers/providerHandler");

const providerRouter = Router();

//Importar los handlers

//Rutas
providerRouter.post("/", createProviderHandler);
providerRouter.get("/", getProviderHandler);
providerRouter.put("/", updateProviderHandler);

module.exports = providerRouter;