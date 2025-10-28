'use client';

import React from 'react';
import { ClientOnly } from './ClientOnly';

export const ClientCandidatesPage: React.FC = () => {
  return (
    <ClientOnly>
      {/* Клієнтські функції для сторінки кандидатів */}
      {/* Наприклад: фільтри, пошук, сортування, тощо */}
      <div className="client-candidates-features">
        {/* Тут можна додати інтерактивні елементи */}
      </div>
    </ClientOnly>
  );
};


