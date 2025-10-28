import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVectorEmbeddings1700000000007 implements MigrationInterface {
  name = 'AddVectorEmbeddings1700000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Встановлюємо pgvector розширення
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // Додаємо векторні поля до таблиці jobs
    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD COLUMN "embeddingText" text,
      ADD COLUMN "embedding" jsonb,
      ADD COLUMN "embeddingUpdatedAt" TIMESTAMP;
    `);

    // Додаємо векторні поля до таблиці candidate_profiles
    await queryRunner.query(`
      ALTER TABLE "candidate_profiles" 
      ADD COLUMN "embeddingText" text,
      ADD COLUMN "embedding" jsonb,
      ADD COLUMN "embeddingUpdatedAt" TIMESTAMP;
    `);

    // Створюємо індекси для швидкого пошуку
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_jobs_embedding" 
      ON "jobs" USING gin ("embedding") 
      WHERE "embedding" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_candidate_profiles_embedding" 
      ON "candidate_profiles" USING gin ("embedding") 
      WHERE "embedding" IS NOT NULL;
    `);

    // Індекс для embeddingUpdatedAt для відстеження оновлень
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_jobs_embedding_updated" 
      ON "jobs" ("embeddingUpdatedAt") 
      WHERE "embeddingUpdatedAt" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_candidate_profiles_embedding_updated" 
      ON "candidate_profiles" ("embeddingUpdatedAt") 
      WHERE "embeddingUpdatedAt" IS NOT NULL;
    `);

    // Створюємо функцію для косинусної схожості (якщо pgvector не підтримує <#>)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cosine_similarity(a jsonb, b jsonb)
      RETURNS float AS $$
      DECLARE
        dot_product float := 0;
        norm_a float := 0;
        norm_b float := 0;
        i int;
        val_a float;
        val_b float;
      BEGIN
        -- Перевіряємо що обидва вектори мають однакову довжину
        IF jsonb_array_length(a) != jsonb_array_length(b) THEN
          RETURN 0;
        END IF;
        
        -- Обчислюємо dot product та норми
        FOR i IN 0..jsonb_array_length(a)-1 LOOP
          val_a := (a->i)::float;
          val_b := (b->i)::float;
          
          dot_product := dot_product + val_a * val_b;
          norm_a := norm_a + val_a * val_a;
          norm_b := norm_b + val_b * val_b;
        END LOOP;
        
        norm_a := sqrt(norm_a);
        norm_b := sqrt(norm_b);
        
        -- Уникаємо ділення на нуль
        IF norm_a = 0 OR norm_b = 0 THEN
          RETURN 0;
        END IF;
        
        RETURN dot_product / (norm_a * norm_b);
      END;
      $$ LANGUAGE plpgsql IMMUTABLE;
    `);

    console.log('✅ Vector embeddings migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Видаляємо функцію
    await queryRunner.query(`DROP FUNCTION IF EXISTS cosine_similarity(jsonb, jsonb);`);

    // Видаляємо індекси
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_jobs_embedding_updated";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_profiles_embedding_updated";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_profiles_embedding";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_jobs_embedding";`);

    // Видаляємо колонки
    await queryRunner.query(`
      ALTER TABLE "candidate_profiles" 
      DROP COLUMN IF EXISTS "embeddingText",
      DROP COLUMN IF EXISTS "embedding",
      DROP COLUMN IF EXISTS "embeddingUpdatedAt";
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      DROP COLUMN IF EXISTS "embeddingText",
      DROP COLUMN IF EXISTS "embedding",
      DROP COLUMN IF EXISTS "embeddingUpdatedAt";
    `);

    // Видаляємо розширення (обережно - може вплинути на інші таблиці)
    // await queryRunner.query(`DROP EXTENSION IF EXISTS vector;`);

    console.log('✅ Vector embeddings migration rolled back successfully');
  }
}
