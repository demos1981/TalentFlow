import { Repository, FindOptionsWhere, FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class BaseService<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      throw new Error(`Помилка отримання всіх записів: ${error.message}`);
    }
  }

  async findById(id: string | number, options?: FindOneOptions<T>): Promise<T | null> {
    try {
      return await this.repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        ...options
      });
    } catch (error) {
      throw new Error(`Помилка отримання запису за ID ${id}: ${error.message}`);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data as any);
      const result = await this.repository.save(entity);
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      throw new Error(`Помилка створення запису: ${error.message}`);
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    try {
      await this.repository.update(id, data as any);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Помилка оновлення запису з ID ${id}: ${error.message}`);
    }
  }

  async delete(id: string | number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      throw new Error(`Помилка видалення запису з ID ${id}: ${error.message}`);
    }
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      throw new Error(`Помилка підрахунку записів: ${error.message}`);
    }
  }

  async exists(id: string | number): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where: { id } as unknown as FindOptionsWhere<T>
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Помилка перевірки існування запису з ID ${id}: ${error.message}`);
    }
  }
}
