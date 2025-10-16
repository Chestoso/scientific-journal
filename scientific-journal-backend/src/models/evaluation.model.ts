import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';

export class Evaluation extends Model {
  public id!: number;
  public articleId!: number;
  public reviewerId!: number;
  public evaluationDate!: Date;
  public approvalStatus!: string;
}

Evaluation.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  articleId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  reviewerId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  evaluationDate: {
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  approvalStatus: {
    type: DataTypes.ENUM('Approved', 'Denied with corrections', 'Rejected', 'Pending'),
    allowNull: false
  }
}, {
  tableName: 'evaluations',
  sequelize: database,   
  timestamps: false
});
