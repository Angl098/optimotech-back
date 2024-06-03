const {Router} = require("express");
const { createTagHandler, getTagHandler, updateTagHandler } = require("../handlers/tagsHandler");

const tagsRouter = Router();

//Importar los handlers

//Rutas
tagsRouter.post("/", createTagHandler);
tagsRouter.get("/", getTagHandler);
tagsRouter.put("/", updateTagHandler);

module.exports = tagsRouter;