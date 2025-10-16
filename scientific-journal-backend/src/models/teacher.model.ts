import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { Article } from './article.model';
import bcrypt from 'bcrypt';

export class Teacher extends Model {
  public id!: number;
  public fullName!: string;
  public university!: string;
  public email!: string;
  public orcid!: string;
  public password!: string; // Nueva propiedad
}

Teacher.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  fullName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  university: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true 
  },
  orcid: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password: { // Campo para la contraseña
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'teachers',
  sequelize: database,
  timestamps: false,
});
