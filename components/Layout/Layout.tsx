'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="main-content-area">
          {children}
        </div>
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;