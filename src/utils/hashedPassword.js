const bcrypt = require('bcrypt');

// Función para hashear una contraseña
async function hashPassword(password) {
    try {
      // Generar un salt (valor aleatorio) para fortalecer el hash
      const salt = await bcrypt.genSalt(10);
      // Hashear la contraseña con el salt
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error al hashear la contraseña');
    }
  }

  // Función para verificar una contraseña
async function verifyPassword(plainPassword, hashedPassword) {
    try {
      // Comparar la contraseña ingresada con el hash almacenado
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      return match;
    } catch (error) {
      throw new Error('Error al verificar la contraseña');
    }
  }
  
  // Ejemplo de uso
  async function main() {
    const plainPassword = 'contraseña123';
    const hashedPassword = '$2b$10$KgIxN...'; // Hash almacenado en la base de datos
    const match = await verifyPassword(plainPassword, hashedPassword);
    if (match) {
      console.log('La contraseña es válida');
    } else {
      console.log('La contraseña no es válida');
    }
  }
  
  

  module.exports = { hashPassword, verifyPassword}