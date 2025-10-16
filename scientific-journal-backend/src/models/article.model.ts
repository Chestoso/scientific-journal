import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { Teacher } from './teacher.model';
import { Reviewer } from './reviewer.model';
import { Evaluation } from './evaluation.model';

export class Article extends Model {
  public id!: number;
  public teacherId!: number;
  public authorType!: 'Principal' | 'Coauthor';
  public title!: string;
  public abstract!: string;
  public keywords!: string;
  public receivedDate!: Date;
}

Article.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  teacherId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  authorType: { 
    type: DataTypes.ENUM('Principal', 'Coauthor'), 
    allowNull: false 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  abstract: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  keywords: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  receivedDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
}, {
  tableName: 'articles',
  sequelize: database,   
  timestamps: false
});

// Relación con evaluación (muchos a muchos con Reviewer a través de Evaluation)
