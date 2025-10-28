import React from 'react';
import { Metadata } from 'next';
import { ServerNavigation } from '../../components/ServerNavigation';
import { ServerFooter } from '../../components/ServerFooter';
import '../../components/ServerComponents.css';
import './about.css';

export const metadata: Metadata = {
  title: 'Про нас - TalentFluent',
  description: 'Дізнайтеся більше про TalentFluent та нашу місію',
  keywords: 'про нас, команда, місія, цінності, TalentFluent',
  openGraph: {
    title: 'Про нас - TalentFluent',
    description: 'Дізнайтеся більше про TalentFluent та нашу місію',
    type: 'website',
  },
};

const AboutPage: React.FC = () => {
  return (
    <>
      <ServerNavigation currentPath="/about" />
      <main className="about-page">
        <div className="about-container">
          <h1 className="about-title">Про нас</h1>
          
          <section className="about-hero">
            <h2>Наша місія</h2>
            <p>
              TalentFluent - це AI-підсилена платформа, яка революціонізує процес найму персоналу. 
              Ми допомагаємо компаніям знаходити найкращих кандидатів, а кандидатам - ідеальну роботу.
            </p>
          </section>

          <section className="about-story">
            <h2>Наша історія</h2>
            <p>
              Заснована в 2024 році, TalentFluent виникла з ідеї використати штучний інтелект 
              для вирішення проблем традиційного рекрутингу. Наша команда експертів з AI, 
              HR та технологій працює над створенням інноваційних рішень для майбутнього найму.
            </p>
          </section>

          <section className="about-values">
            <h2>Наші цінності</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Інновації</h3>
                <p>Ми постійно вдосконалюємо наші технології та підходи до найму.</p>
              </div>
              <div className="value-card">
                <h3>Прозорість</h3>
                <p>Ми забезпечуємо чесний та відкритий процес найму для всіх сторін.</p>
              </div>
              <div className="value-card">
                <h3>Ефективність</h3>
                <p>Наша мета - зробити процес найму швидшим та результативнішим.</p>
              </div>
              <div className="value-card">
                <h3>Якість</h3>
                <p>Ми прагнемо до найвищих стандартів у всьому, що робимо.</p>
              </div>
            </div>
          </section>

          <section className="about-team">
            <h2>Наша команда</h2>
            <p>
              Наша команда складається з досвідчених фахівців у галузі штучного інтелекту, 
              HR-технологій та розробки програмного забезпечення. Ми об'єдналися з метою 
              створення найкращої платформи для найму персоналу.
            </p>
          </section>

          <section className="about-contact">
            <h2>Зв'яжіться з нами</h2>
            <p>
              Маєте питання або пропозиції? Ми завжди раді почути від вас!
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> info@talentflow.ua
              </div>
              <div className="contact-item">
                <strong>Телефон:</strong> +380 44 123 45 67
              </div>
              <div className="contact-item">
                <strong>Адреса:</strong> Київ, Україна
              </div>
            </div>
          </section>
        </div>
      </main>
      <ServerFooter />
    </>
  );
};

export default AboutPage;