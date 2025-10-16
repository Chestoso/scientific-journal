import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { Article } from './article.model';

export class RequirementVerification extends Model {
  public id!: number;
  public articleId!: number;
  public verificationDate!: Date;
  public meetsRequirements!: 'Yes' | 'No';
  public observations!: string;
}

RequirementVerification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  // FK al artículo que se está verificando
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Fecha en que se verificaron los requisitos editoriales
  verificationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  // Resultado de la verificación: 'Yes' o 'No'
  meetsRequirements: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false
  },

  // Observaciones adicionales sobre la verificación
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'requirement_verifications',
  sequelize: database,
  timestamps: false
});

// Relación uno a uno con el artículo

