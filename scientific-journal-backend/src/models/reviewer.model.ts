import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { Article } from './article.model';
import { Evaluation } from './evaluation.model';

export class Reviewer extends Model {
  public id!: number;
  public fullName!: string;
  public specialty!: string;
  public email!: string;
  public university!: string;
}

Reviewer.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  fullName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  specialty: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  university: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, {
  tableName: 'reviewers',
  sequelize: database,   
  timestamps: false
});

// Relación N:N con Artículo
