const cloudinary = require('cloudinary').v2;
const fs = require("fs-extra");
const cloudinaryPush = async (imagePaths) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  // Opciones para la carga de imágenes en Cloudinary
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  const uploadedImageUrls = [];
  // Iterar sobre cada ruta de imagen en el array
  for (const imagePath of imagePaths) {
    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, options);

    // Almacenar la URL de la imagen subida
    uploadedImageUrls.push(result.secure_url);
    // Eliminar el archivo local después de subirlo a Cloudinary
    await fs.unlink(imagePath);
  }
  // Devolver las URLs de las imágenes subidas
  return uploadedImageUrls;

}
module.exports = cloudinaryPush;