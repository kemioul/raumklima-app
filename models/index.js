const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const Temperatur = sequelize.define('Temperatur', {
    wert: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    freezeTableName: true
  });
  
  const Feuchtigkeit = sequelize.define('Feuchtigkeit', {
    wert: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    freezeTableName: true
  });
  

module.exports = { sequelize, Temperatur, Feuchtigkeit };
