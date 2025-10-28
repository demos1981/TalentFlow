"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../stores/authStore";

interface ClientAuthButtonsProps {
  t?: (key: any) => string;
}

const ClientAuthButtons: React.FC<ClientAuthButtonsProps> = ({ t }) => {
  const { isAuthenticated } = useAuthStore();

  // Fallback translations if t function is not provided
  const fallbackT = (key: string): string => {
    const fallbacks: Record<string, string> = {
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard'
    };
    return fallbacks[key] || key;
  };

  const translate = t || fallbackT;

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="btn btn-primary"
      >
        {translate('dashboard')}
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/auth?type=login"
        className="btn btn-outline"
      >
        {translate('login')}
      </Link>
      <Link
        href="/auth?type=register"
        className="btn btn-primary"
      >
        {translate('register')}
      </Link>
    </>
  );
};

export default ClientAuthButtons;
