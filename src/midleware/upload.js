const multer = require("multer");
const path = require("path");

const destinationPath = path.join(process.cwd(), "src", "public/img/upload");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationPath); // Carpeta de destino para guardar los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nombre del archivo en el servidor
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new Error("El archivo no es una imagen."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Tamaño máximo del archivo (1 MB)
  },
  fileFilter: imageFilter,
});

module.exports = upload;