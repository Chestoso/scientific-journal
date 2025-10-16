import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { Evaluation } from './evaluation.model';

export class EvaluationDetail extends Model {
  public id!: number;
  public evaluationId!: number;
  public description!: string;
  public evaluationStatus!: string;
}

EvaluationDetail.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  // FK a la tabla evaluación
  evaluationId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  // Descripción detallada del dictamen del evaluador
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  // Estado del dictamen: Positivo, Negativo, Neutral
  evaluationStatus: { 
    type: DataTypes.ENUM('Positive', 'Negative', 'Rejected', 'Neutral'),
    allowNull: false 
   }
}, {
  tableName: 'evaluation_details',
  sequelize: database,
  timestamps: false
});

// Relación muchos a uno con Evaluación

