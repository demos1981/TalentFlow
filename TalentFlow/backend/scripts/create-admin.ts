import { AppDataSource } from '../src/config/database';
import { User, UserRole } from '../src/models/User';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    // Ініціалізуємо підключення до бази даних
    await AppDataSource.initialize();
    console.log('✅ Database connection initialized');

    const userRepository = AppDataSource.getRepository(User);

    // Перевіряємо чи адмін вже існує
    const existingAdmin = await userRepository.findOne({
      where: { email: 'mikeleilyashadmin@gmail.com' }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email');
      return;
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Створюємо адміна
    const adminUser = userRepository.create({
      email: 'mikeleilyashadmin@gmail.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Зберігаємо в базу
    const savedAdmin = await userRepository.save(adminUser);

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', savedAdmin.email);
    console.log('🔑 Password: admin');
    console.log('👤 Role:', savedAdmin.role);
    console.log('🆔 ID:', savedAdmin.id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    // Закриваємо підключення
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Запускаємо скрипт
createAdmin();
