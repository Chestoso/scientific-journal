import { Article } from './article.model';
import { Teacher } from './teacher.model';
import { Reviewer } from './reviewer.model';
import { Evaluation } from './evaluation.model';
import { EvaluationDetail } from './evaluation_detail.model';
import { ArticlePublication } from './article_publication.model';
import { RequirementVerification } from './requirement_verification.model';

// Teacher (1) <--> (N) Article
Teacher.hasMany(Article, {
  foreignKey: 'teacherId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Article.belongsTo(Teacher, {
  foreignKey: 'teacherId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Article (1) <--> (1) ArticlePublication
Article.hasOne(ArticlePublication, {
  foreignKey: 'articleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
ArticlePublication.belongsTo(Article, {
  foreignKey: 'articleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Article (1) <--> (1) RequirementVerification
Article.hasOne(RequirementVerification, {
  foreignKey: 'articleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
RequirementVerification.belongsTo(Article, {
  foreignKey: 'articleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Article (N) <--> (N) Reviewer through Evaluation
Article.belongsToMany(Reviewer, {
  through: Evaluation,
  foreignKey: 'articleId',
  otherKey: 'reviewerId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Reviewer.belongsToMany(Article, {
  through: Evaluation,
  foreignKey: 'reviewerId',
  otherKey: 'articleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Evaluation (1) <--> (N) EvaluationDetail
Evaluation.hasMany(EvaluationDetail, {
  foreignKey: 'evaluationId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
EvaluationDetail.belongsTo(Evaluation, {
  foreignKey: 'evaluationId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
