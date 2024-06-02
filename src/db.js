require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Leo las variables de entorno
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_DEPLOY
} = process.env;

///////////////BASE//DE//DATOS//LOCAL/////////////////////////////////////////////////////////////////////
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
///////////////BASE//DE//DATOS//DEPLOY/////////////////////////////////////////////////////////////////////

// const sequelize = new Sequelize(DB_DEPLOY, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
///////////////////////////////////////////////////////////////////////////////////////////////////////////

const basename = path.basename(__filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Suplement, User, Category, Orden, OrdenSuplement, Cart, CartSuplements } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Suplement.belongsToMany(User, { through: 'suplement_user' });
User.belongsToMany(Suplement, { through: 'suplement_user' });

Suplement.belongsToMany(Category, { through: "category_suplement" });
Category.belongsToMany(Suplement, { through: "category_suplement" });


Orden.belongsTo(User, { foreignKey: 'userId' });
Orden.belongsToMany(Suplement, { through: 'orden_suplement', foreignKey: 'ordenId' });
Suplement.belongsToMany(Orden, { through: 'orden_suplement', foreignKey: 'suplementId' });



User.hasMany(Cart, { as: 'carts', foreignKey: 'userId' });
Cart.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Cart.belongsToMany(Suplement, { through: CartSuplements, foreignKey: 'cartId' });
Suplement.belongsToMany(Cart, { through: CartSuplements, foreignKey: 'suplementId' });


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};