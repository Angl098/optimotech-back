const {Router} = require("express");
const { createCategoryHandler, getCategoryHandler, updateCategoryHandler } = require("../handlers/categoryHandler");

const categoryRouter = Router();

//Importar los handlers

//Rutas
categoryRouter.post("/", createCategoryHandler);
categoryRouter.get("/", getCategoryHandler);
categoryRouter.put("/", updateCategoryHandler);

module.exports = categoryRouter;