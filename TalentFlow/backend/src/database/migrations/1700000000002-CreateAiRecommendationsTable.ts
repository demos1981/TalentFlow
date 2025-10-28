import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAiRecommendationsTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Створюємо enum для типів рекомендацій
    await queryRunner.query(`
      CREATE TYPE "recommendation_type_enum" AS ENUM (
        'candidate_to_job',
        'job_to_candidate'
      )
    `);

    // Створюємо enum для категорій матчингу
    await queryRunner.query(`
      CREATE TYPE "match_score_enum" AS ENUM (
        'excellent',
        'good',
        'average',
        'poor'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ai_recommendations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "recommendation_type_enum" NOT NULL,
        "candidateId" uuid NOT NULL,
        "jobId" uuid NOT NULL,
        "matchScore" decimal(5,2) NOT NULL DEFAULT 0,
        "matchScoreCategory" "match_score_enum" NOT NULL DEFAULT 'poor',
        "skillsMatch" jsonb,
        "experienceMatch" jsonb,
        "locationMatch" jsonb,
        "salaryMatch" jsonb,
        "aiReason" text,
        "aiMetadata" jsonb,
        "isActive" boolean NOT NULL DEFAULT true,
        "isViewed" boolean NOT NULL DEFAULT false,
        "isContacted" boolean NOT NULL DEFAULT false,
        "viewedAt" timestamp,
        "contactedAt" timestamp,
        "feedback" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_57aa33b4356a91e94e98bcd3f2d" PRIMARY KEY ("id")
      );
      
      COMMENT ON COLUMN "ai_recommendations"."type" IS 'Тип рекомендації: кандидат для вакансії або вакансія для кандидата';
      COMMENT ON COLUMN "ai_recommendations"."skillsMatch" IS 'Деталі матчингу по навичках';
      COMMENT ON COLUMN "ai_recommendations"."experienceMatch" IS 'Деталі матчингу по досвіду';
      COMMENT ON COLUMN "ai_recommendations"."locationMatch" IS 'Деталі матчингу по локації';
      COMMENT ON COLUMN "ai_recommendations"."salaryMatch" IS 'Деталі матчингу по зарплаті';
      COMMENT ON COLUMN "ai_recommendations"."aiReason" IS 'AI пояснення матчингу';
      COMMENT ON COLUMN "ai_recommendations"."aiMetadata" IS 'Метадані AI моделі';
      COMMENT ON COLUMN "ai_recommendations"."feedback" IS 'Відгук користувача про рекомендацію';
    `);

    // Створюємо індекси для швидкого пошуку
    await queryRunner.createIndex(
      'ai_recommendations',
      new TableIndex({
        name: 'IDX_AI_RECOMMENDATIONS_CANDIDATE_JOB_TYPE',
        columnNames: ['candidateId', 'jobId', 'type'],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      'ai_recommendations',
      new TableIndex({
        name: 'IDX_AI_RECOMMENDATIONS_MATCH_SCORE_CREATED',
        columnNames: ['matchScore', 'createdAt'],
      })
    );

    await queryRunner.createIndex(
      'ai_recommendations',
      new TableIndex({
        name: 'IDX_AI_RECOMMENDATIONS_TYPE_ACTIVE',
        columnNames: ['type', 'isActive'],
      })
    );

    await queryRunner.createIndex(
      'ai_recommendations',
      new TableIndex({
        name: 'IDX_AI_RECOMMENDATIONS_CANDIDATE_ID',
        columnNames: ['candidateId'],
      })
    );

    await queryRunner.createIndex(
      'ai_recommendations',
      new TableIndex({
        name: 'IDX_AI_RECOMMENDATIONS_JOB_ID',
        columnNames: ['jobId'],
      })
    );

    await queryRunner.createIndex(
      'ai_recommendations',
      new TableIndex({
        name: 'IDX_AI_RECOMMENDATIONS_MATCH_SCORE_CATEGORY',
        columnNames: ['matchScoreCategory'],
      })
    );

    // Створюємо зовнішні ключі
    await queryRunner.createForeignKey(
      'ai_recommendations',
      new TableForeignKey({
        name: 'FK_AI_RECOMMENDATIONS_CANDIDATE',
        columnNames: ['candidateId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'ai_recommendations',
      new TableForeignKey({
        name: 'FK_AI_RECOMMENDATIONS_JOB',
        columnNames: ['jobId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    // Додаємо коментарі до таблиці
    await queryRunner.query(`
      COMMENT ON TABLE "ai_recommendations" IS 'AI рекомендації для матчингу кандидатів та вакансій';
      COMMENT ON COLUMN "ai_recommendations"."type" IS 'Тип рекомендації: candidate_to_job або job_to_candidate';
      COMMENT ON COLUMN "ai_recommendations"."matchScore" IS 'Бал матчингу від 0 до 100';
      COMMENT ON COLUMN "ai_recommendations"."matchScoreCategory" IS 'Категорія матчингу: excellent (90-100), good (80-89), average (70-79), poor (0-69)';
      COMMENT ON COLUMN "ai_recommendations"."skillsMatch" IS 'JSON з деталями матчингу по навичках: {matched: [], missing: [], score: number}';
      COMMENT ON COLUMN "ai_recommendations"."experienceMatch" IS 'JSON з деталями матчингу по досвіду: {required: string, candidate: string, score: number}';
      COMMENT ON COLUMN "ai_recommendations"."locationMatch" IS 'JSON з деталями матчингу по локації: {required: string, candidate: string, score: number}';
      COMMENT ON COLUMN "ai_recommendations"."salaryMatch" IS 'JSON з деталями матчингу по зарплаті: {required: {min, max}, candidate: {min, max}, score: number}';
      COMMENT ON COLUMN "ai_recommendations"."aiReason" IS 'AI пояснення чому цей матч є хорошим';
      COMMENT ON COLUMN "ai_recommendations"."aiMetadata" IS 'JSON з метаданими AI моделі: {model: string, confidence: number, processingTime: number, features: []}';
      COMMENT ON COLUMN "ai_recommendations"."feedback" IS 'JSON з відгуком користувача: {rating: number, comment: string, createdAt: Date}';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Видаляємо зовнішні ключі
    const table = await queryRunner.getTable('ai_recommendations');
    if (table) {
      const foreignKeyCandidate = table.foreignKeys.find(fk => fk.columnNames.indexOf('candidateId') !== -1);
      const foreignKeyJob = table.foreignKeys.find(fk => fk.columnNames.indexOf('jobId') !== -1);
      
      if (foreignKeyCandidate) {
        await queryRunner.dropForeignKey('ai_recommendations', foreignKeyCandidate);
      }
      if (foreignKeyJob) {
        await queryRunner.dropForeignKey('ai_recommendations', foreignKeyJob);
      }
    }

    // Видаляємо таблицю
    await queryRunner.dropTable('ai_recommendations');

    // Видаляємо enum типи
    await queryRunner.query('DROP TYPE "recommendation_type_enum"');
    await queryRunner.query('DROP TYPE "match_score_enum"');
  }
}
