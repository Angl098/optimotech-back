const cloudinary = require('cloudinary').v2;
const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Image with public ID ${publicId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting image with public ID ${publicId}:`, error);
  }
};

module.exports = deleteImageFromCloudinary;
