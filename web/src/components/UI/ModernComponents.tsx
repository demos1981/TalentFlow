import React from 'react';

// Приклади використання нових Tailwind компонентів

export const ModernButtonExample: React.FC = () => (
  <div className="space-modern">
    <button className="btn-modern btn-modern-primary">
      Primary Button
    </button>
    <button className="btn-modern btn-modern-secondary">
      Secondary Button
    </button>
    <button className="btn-modern btn-modern-success">
      Success Button
    </button>
    <button className="btn-modern btn-modern-warning">
      Warning Button
    </button>
    <button className="btn-modern btn-modern-danger">
      Danger Button
    </button>
    <button className="btn-modern btn-modern-outline">
      Outline Button
    </button>
  </div>
);

export const ModernCardExample: React.FC = () => (
  <div className="grid-modern-cards">
    <div className="card-modern">
      <h3 className="text-modern-title">Modern Card</h3>
      <p className="text-modern-body">This is a modern card with glassmorphism effect.</p>
    </div>
    <div className="card-modern-glass">
      <h3 className="text-modern-title">Glass Card</h3>
      <p className="text-modern-body">This is a glass card with backdrop blur.</p>
    </div>
    <div className="card-modern-gradient">
      <h3 className="text-modern-title">Gradient Card</h3>
      <p className="text-modern-body">This is a gradient card with modern styling.</p>
    </div>
  </div>
);

export const ModernInputExample: React.FC = () => (
  <div className="space-modern">
    <input 
      type="text" 
      placeholder="Modern Input" 
      className="input-modern"
    />
    <input 
      type="email" 
      placeholder="Floating Input" 
      className="input-modern-floating"
    />
  </div>
);

export const ModernNavigationExample: React.FC = () => (
  <nav className="space-modern">
    <a href="#" className="nav-modern nav-modern-active">
      Active Link
    </a>
    <a href="#" className="nav-modern">
      Regular Link
    </a>
    <a href="#" className="nav-modern">
      Another Link
    </a>
  </nav>
);

export const ModernBadgeExample: React.FC = () => (
  <div className="space-modern">
    <span className="badge-modern badge-modern-primary">Primary</span>
    <span className="badge-modern badge-modern-success">Success</span>
    <span className="badge-modern badge-modern-warning">Warning</span>
    <span className="badge-modern badge-modern-danger">Danger</span>
  </div>
);

export const ModernTableExample: React.FC = () => (
  <table className="table-modern">
    <thead className="table-modern-header">
      <tr>
        <th className="table-modern-cell">Name</th>
        <th className="table-modern-cell">Email</th>
        <th className="table-modern-cell">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr className="table-modern-row">
        <td className="table-modern-cell">John Doe</td>
        <td className="table-modern-cell">john@example.com</td>
        <td className="table-modern-cell">
          <span className="badge-modern badge-modern-success">Active</span>
        </td>
      </tr>
      <tr className="table-modern-row">
        <td className="table-modern-cell">Jane Smith</td>
        <td className="table-modern-cell">jane@example.com</td>
        <td className="table-modern-cell">
          <span className="badge-modern badge-modern-warning">Pending</span>
        </td>
      </tr>
    </tbody>
  </table>
);

export const ModernLoadingExample: React.FC = () => (
  <div className="space-modern">
    <div className="loading-modern"></div>
    <div className="loading-modern-dots">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export const ModernTypographyExample: React.FC = () => (
  <div className="space-modern">
    <h1 className="text-modern-title">Modern Title</h1>
    <h2 className="text-modern-subtitle">Modern Subtitle</h2>
    <p className="text-modern-body">
      This is modern body text with improved readability and spacing.
    </p>
  </div>
);

export const ModernGridExample: React.FC = () => (
  <div className="grid-modern-dashboard">
    <div className="card-modern animate-float">
      <h3>Floating Card</h3>
      <p>This card has a floating animation.</p>
    </div>
    <div className="card-modern animate-pulse-slow">
      <h3>Pulse Card</h3>
      <p>This card has a slow pulse animation.</p>
    </div>
    <div className="card-modern animate-bounce-slow">
      <h3>Bounce Card</h3>
      <p>This card has a slow bounce animation.</p>
    </div>
  </div>
);

export const ModernShimmerExample: React.FC = () => (
  <div className="space-modern">
    <div className="card-modern animate-shimmer">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);
