const { sequelize } = require('./index');
const { DataTypes } = require('sequelize');

const UserSkill = sequelize.define('skill_d', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  skill_name: { type: DataTypes.STRING, allowNull: false },
  skill_level: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'skill_d',
  timestamps: false,
});

module.exports = UserSkill;
