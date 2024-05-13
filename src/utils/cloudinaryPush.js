const cloudinary = require('cloudinary').v2;

 const cloudinaryPush = async (imagePaths) => {
        
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
