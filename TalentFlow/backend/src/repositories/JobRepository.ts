import { Repository } from 'typeorm';
import { Job } from '../models/Job';
import { AppDataSource } from '../config/database';

export class JobRepository extends Repository<Job> {
  constructor() {
    super(Job, AppDataSource.manager);
  }
}
