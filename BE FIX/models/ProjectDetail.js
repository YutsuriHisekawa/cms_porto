const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const Project = require('./Project');

const ProjectDetail = sequelize.define('ProjectDetail', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  project_uuid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'project',
      key: 'uuid',
    },
  },
  picture_url: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'project_d',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Project.hasMany(ProjectDetail, { foreignKey: 'project_uuid', as: 'details' });
ProjectDetail.belongsTo(Project, { foreignKey: 'project_uuid', as: 'project' });

module.exports = ProjectDetail;
