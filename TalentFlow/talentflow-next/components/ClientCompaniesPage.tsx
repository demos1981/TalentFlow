'use client';

import React from 'react';
import { ClientOnly } from './ClientOnly';

export const ClientCompaniesPage: React.FC = () => {
  return (
    <ClientOnly>
      {/* Клієнтські функції для сторінки компаній */}
      {/* Наприклад: фільтри, пошук, сортування, тощо */}
      <div className="client-companies-features">
        {/* Тут можна додати інтерактивні елементи */}
      </div>
    </ClientOnly>
  );
};