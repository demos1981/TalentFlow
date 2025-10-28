import React from 'react';
import { Metadata } from 'next';
import { ServerNavigation } from '../../components/ServerNavigation';
import { ServerFooter } from '../../components/ServerFooter';
import ContactContent from './ContactContent';
import '../../components/ServerComponents.css';
import './contact.css';
import Layout from '../../components/Layout/Layout';


export const metadata: Metadata = {
  title: 'Контакти - TalentFluent',
  description: 'Зв\'яжіться з нами для отримання допомоги або консультації',
  keywords: 'контакти, підтримка, допомога, консультація, TalentFluent',
  openGraph: {
    title: 'Контакти - TalentFluent',
    description: 'Зв\'яжіться з нами для отримання допомоги або консультації',
    type: 'website',
  },
};

const ContactPage: React.FC = () => {
  return (
    <>
      <Layout>
        <ContactContent />
      </Layout>
    </>
  );
};

export default ContactPage;