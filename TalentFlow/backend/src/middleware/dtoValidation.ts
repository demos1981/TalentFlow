import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Middleware для валідації DTO
 * @param dtoClass - Клас DTO для валідації
 * @param skipMissingProperties - Пропускати відсутні властивості (для PATCH запитів)
 */
export function validateDto<T extends object>(
  dtoClass: new () => T,
  skipMissingProperties: boolean = false
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Перетворюємо plain object в instance класу DTO
      const dto = plainToClass(dtoClass, req.body);
      
      // Валідуємо DTO
      const errors: ValidationError[] = await validate(dto, {
        skipMissingProperties,
        whitelist: true, // Видаляємо властивості без декораторів
        forbidNonWhitelisted: true // Забороняємо невідомі властивості
      });

      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return `${error.property}: validation failed`;
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages
        });
      }

      // Замінюємо req.body на валідований та трансформований об'єкт
      req.body = dto;
      return next();
    } catch (error) {
      console.error('DTO validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error'
      });
    }
  };
}

/**
 * Middleware для валідації DTO з гнучкими налаштуваннями для оновлення
 * @param dtoClass - Клас DTO для валідації
 * @param skipMissingProperties - Пропускати відсутні властивості
 */
export function validateDtoForUpdate<T extends object>(
  dtoClass: new () => T,
  skipMissingProperties: boolean = true
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Перетворюємо plain object в instance класу DTO
      const dto = plainToClass(dtoClass, req.body);
      
      console.log(`🔍 DTO Validation for ${dtoClass.name}:`, {
        originalBody: req.body,
        transformedDto: dto,
        skipMissingProperties
      });
      
      // Валідуємо DTO з гнучкими налаштуваннями для оновлення
      const errors: ValidationError[] = await validate(dto, {
        skipMissingProperties,
        whitelist: true, // Видаляємо властивості без декораторів
        forbidNonWhitelisted: false // Дозволяємо додаткові властивості для гнучкості
      });

      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return `${error.property}: validation failed`;
        });

        console.error(`❌ DTO Validation failed for ${dtoClass.name}:`, {
          errors: errorMessages,
          rawErrors: errors,
          originalBody: req.body,
          transformedDto: dto
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages
        });
      }

      console.log(`✅ DTO Validation passed for ${dtoClass.name}`);

      // Замінюємо req.body на валідований та трансформований об'єкт
      req.body = dto;
      return next();
    } catch (error) {
      console.error('DTO validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error'
      });
    }
  };
}

/**
 * Middleware для валідації параметрів URL (наприклад, UUID)
 */
export function validateParams<T extends object>(
  dtoClass: new () => T
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(dtoClass, req.params);
      const errors: ValidationError[] = await validate(dto, {
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return `${error.property}: validation failed`;
        });

        return res.status(400).json({
          success: false,
          message: 'Invalid parameters',
          errors: errorMessages
        });
      }

      req.params = dto as any;
      return next();
    } catch (error) {
      console.error('Params validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error'
      });
    }
  };
}

/**
 * Middleware для валідації query параметрів
 */
export function validateQuery<T extends object>(
  dtoClass: new () => T
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(dtoClass, req.query);
      const errors: ValidationError[] = await validate(dto, {
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return `${error.property}: validation failed`;
        });

        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: errorMessages
        });
      }

      req.query = dto as any;
      return next();
    } catch (error) {
      console.error('Query validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error'
      });
    }
  };
}


