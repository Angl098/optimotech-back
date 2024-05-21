const {Router} = require("express");
const { createCategoryHandler, getCategoryHandler } = require("../handlers/categoryHandler");

const categoryRouter = Router();

//Importar los handlers

//Rutas
categoryRouter.post("/", createCategoryHandler);
categoryRouter.get("/", getCategoryHandler);

module.exports = categoryRouter;