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
const { Suplement, User, Category, Orden, Provider, Tag, OrdenSuplement, Cart, CartSuplements, Comment } = sequelize.models;
// Aca vendrian las relaciones
// Product.hasMany(Reviews);

// Una categoría tiene muchos suplementos
Category.hasMany(Suplement, {
  foreignKey: 'CategoryId',
  onDelete: 'CASCADE'
});

// Un suplemento pertenece a una categoría
Suplement.belongsTo(Category, {
  foreignKey: 'CategoryId'
});

// User.hasMany(Cart, { as: 'carts', foreignKey: 'userId' });
// Suplement.hasMany(CartItem, { as: 'itemProducts', foreignKey: 'suplementId' });

Orden.belongsTo(User, { foreignKey: 'userId' });
Orden.belongsToMany(Suplement, { through: 'orden_suplement', foreignKey: 'ordenId' });
Suplement.belongsToMany(Orden, { through: 'orden_suplement', foreignKey: 'suplementId' });



User.hasMany(Cart, { as: 'carts', foreignKey: 'userId' });
Cart.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Cart.belongsToMany(Suplement, { through: CartSuplements, foreignKey: 'cartId' });
Suplement.belongsToMany(Cart, { through: CartSuplements, foreignKey: 'suplementId' });


Suplement.belongsTo(Provider);
Provider.hasMany(Suplement);

Suplement.belongsToMany(Tag, { through: "SuplementTag" });
Tag.belongsToMany(Suplement, { through: "SuplementTag" });

Suplement.hasMany(Comment, { foreignKey: 'suplementId', onDelete: 'CASCADE' });
Comment.belongsTo(Suplement, { foreignKey: 'suplementId' });

User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Comment.hasMany(Comment, { as: 'responses', foreignKey: 'parentId', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};