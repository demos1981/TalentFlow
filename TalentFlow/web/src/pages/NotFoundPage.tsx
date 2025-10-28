import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">404 - Сторінку не знайдено</h1>
          <p className="dashboard-greeting-subtitle">
            Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена
          </p>
        </div>
      </div>

      <div className="dashboard-section-card">
        <div className="dashboard-section-content">
          {/* 404 іконка */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-600 dark:text-gray-300">404</span>
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="dashboard-section-title text-center">
            Сторінку не знайдено
          </h2>
          
          <p className="dashboard-greeting-subtitle text-center">
            Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена.
          </p>

          {/* Дії */}
          <div className="dashboard-actions">
            <Link
              to="/"
              className="btn btn-primary btn-lg"
            >
              <Home className="icon" />
              На головну
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline btn-lg"
            >
              <ArrowLeft className="icon" />
              Назад
            </button>
          </div>

          {/* Додаткова допомога */}
          <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="dashboard-section-title text-center">
              Не можете знайти те, що шукаєте?
            </h3>
            
            <div className="dashboard-actions">
              <Link
                to="/jobs"
                className="btn btn-secondary"
              >
                <Search className="icon" />
                Пошук вакансій
              </Link>
              
              <Link
                to="/candidates"
                className="btn btn-secondary"
              >
                <Search className="icon" />
                Пошук кандидатів
              </Link>
              
              <Link
                to="/contact"
                className="btn btn-outline"
              >
                Зв'язатися з підтримкою
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
