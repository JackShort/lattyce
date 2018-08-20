import Sequelize, { Op } from 'sequelize';


const db = new Sequelize('constellations', 'jackshort', 'jshort', {
    host: 'localhost',
    dialect: 'postgres',
    port: '5432',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    operatorsAliases: Op,
    define: {
      freezeTableName: true,
    },
});

export default db;
