import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Особливості', href: '/features' },
      { name: 'Тарифи', href: '/pricing' },
      { name: 'API', href: '/api' },
      { name: 'Інтеграції', href: '/integrations' },
      { name: 'Шаблони', href: '/templates' },
    ],
    company: [
      { name: 'Про нас', href: '/about' },
      { name: 'Команда', href: '/team' },
      { name: 'Кар\'єра', href: '/careers' },
      { name: 'Блог', href: '/blog' },
      { name: 'Прес-релізи', href: '/press' },
    ],
    support: [
      { name: 'Допомога', href: '/help' },
      { name: 'Документація', href: '/docs' },
      { name: 'Контакти', href: '/contact' },
      { name: 'Статус', href: '/status' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Умови використання', href: '/terms' },
      { name: 'Політика конфіденційності', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
      { name: 'Безпека', href: '/security' },
    ],
  };

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/talentflow',
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/talentflow',
      icon: Twitter,
      color: 'hover:text-blue-500',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/talentflow',
      icon: Linkedin,
      color: 'hover:text-blue-700',
    },
    {
      name: 'Email',
      href: 'mailto:hello@talentflow.io',
      icon: Mail,
      color: 'hover:text-red-500',
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Основна частина */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Логотип та опис */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                <span className="text-blue-600">Talent</span>Match Pro
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              AI-підсилена платформа для автоматизації найму та управління талантами. 
              Революціонізуйте ваш процес найму з високою точністю.
            </p>
            
            {/* Контактна інформація */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:hello@talentflow.io" className="hover:text-blue-600">
  hello@talentflow.io
</a>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <a href="tel:+380441234567" className="hover:text-blue-600">
                  +380 44 123 45 67
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Київ, Україна</span>
              </div>
            </div>
          </div>

          {/* Продукт */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Продукт
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компанія */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Компанія
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Підтримка */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Підтримка
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Правова інформація */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Правова інформація
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Розділювач */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Копірайт */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>&copy; {currentYear} TalentFlow. Всі права захищені.</span>
              <span className="mx-2">•</span>
              <span>Створено з</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>в Україні</span>
            </div>

            {/* Соціальні мережі */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors ${social.color}`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
