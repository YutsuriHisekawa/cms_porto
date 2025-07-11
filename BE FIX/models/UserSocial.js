const { sequelize } = require('./index');
const { DataTypes } = require('sequelize');

const UserSocial = sequelize.define('sosial_d', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  platform: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'sosial_d',
  timestamps: false,
});

module.exports = UserSocial;
