import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Search, Users, Briefcase, TrendingUp, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Search className="icon" />,
      title: "AI-підсилений матчинг",
      description: "Висока точність завдяки машинному навчанню та аналізу даних",
      color: "blue",
    },
    {
      icon: <Users className="icon" />,
      title: "Автоматизовані інтерв'ю",
      description: "Значна економія часу з інтелектуальними оцінками кандидатів",
      color: "green",
    },
    {
      icon: <Briefcase className="icon" />,
      title: "Розширена аналітика",
      description: "ROI найму, прогнозування та детальні звіти для рішень",
      color: "purple",
    },
    {
      icon: <TrendingUp className="icon" />,
      title: "Масштабованість",
      description: "Мікросервісна архітектура для росту вашого бізнесу",
      color: "orange",
    },
    {
      icon: <Shield className="icon" />,
      title: "Безпека та GDPR",
      description: "Повна відповідність європейським стандартам захисту даних",
      color: "red",
    },
    {
      icon: <Zap className="icon" />,
      title: "Швидка інтеграція",
      description: "API та webhook для підключення до ваших HR систем",
      color: "indigo",
    },
  ];

  const stats = [
    { number: "Висока", label: "Точність AI матчингу" },
    { number: "Значна", label: "Економія часу найму" },
    { number: "Висока", label: "Ефективність найму" },
    { number: "24/7", label: "Доступність платформи" },
  ];

  return (
    <div className="dashboard-content">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-nav">
            <div className="dashboard-header-logo">
              <h1 className="dashboard-title">
                <span className="dashboard-title-accent">Talent</span>Flow
              </h1>
            </div>
            <nav className="dashboard-header-menu">
              <a href="#features">Особливості</a>
              <a href="#pricing">Тарифи</a>
              <a href="#about">Про нас</a>
              <a href="#contact">Контакти</a>
            </nav>
            <div className="dashboard-header-actions">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary"
                >
                  Дашборд
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="btn btn-outline"
                  >
                    Увійти
                  </Link>
                  <Link
                    to="/auth"
                    className="btn btn-primary"
                  >
                    Реєстрація
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="dashboard-section-card">
        <div className="dashboard-section-content">
          <h2 className="dashboard-section-title">Революція в наймі персоналу</h2>
          <p className="dashboard-greeting-subtitle">AI-підсилена платформа для знаходження та найму найкращих талантів</p>
          <div className="dashboard-actions">
            <Link
              to="/auth"
              className="btn btn-primary btn-lg"
            >
              Почати безкоштовно
              <ArrowRight className="icon" />
            </Link>
            <a
              href="#demo"
              className="btn btn-secondary btn-lg"
            >
              Демо версія
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="dashboard-section-card"
      >
        <h2 className="dashboard-section-title">Ключові особливості</h2>
        <div className="dashboard-sections-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="summary-card"
            >
              <div className="summary-card-icon">{feature.icon}</div>
              <h3 className="summary-card-label">{feature.title}</h3>
              <p className="summary-card-change">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="dashboard-section-card">
        <h2 className="dashboard-section-title">Наші досягнення</h2>
        <div className="dashboard-summary-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="summary-card"
            >
              <div className="summary-card-value">{stat.number}</div>
              <div className="summary-card-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="dashboard-section-card">
        <div className="dashboard-section-content">
          <h2 className="dashboard-section-title">Готові перетворити ваш процес найму?</h2>
          <p className="dashboard-greeting-subtitle">Приєднуйтесь до тисяч компаній, які вже використовують TalentFlow</p>
          <div className="dashboard-actions">
            <Link
              to="/auth"
              className="btn btn-primary btn-lg"
            >
              Створити акаунт
              <ArrowRight className="icon" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
