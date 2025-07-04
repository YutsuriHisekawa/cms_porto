const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Project = sequelize.define('Project', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  upload_header: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'project',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Project;
