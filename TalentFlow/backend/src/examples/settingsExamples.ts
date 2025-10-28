/**
 * Приклади використання Settings API
 * 
 * Settings API надає можливість управління налаштуваннями користувача,
 * включаючи профіль, сповіщення, приватність, зовнішній вигляд та безпеку.
 */

export const settingsExamples = {
  // ===== ОСНОВНІ НАЛАШТУВАННЯ =====
  
  /**
   * Отримання налаштувань користувача
   */
  getUserSettings: {
    method: 'GET',
    url: '/api/settings',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    response: {
      success: true,
      message: 'User settings retrieved successfully',
      data: {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+380501234567',
          location: 'Kyiv, Ukraine',
          city: 'Kyiv',
          country: 'Ukraine',
          bio: 'Experienced software developer with 5+ years in web development',
          avatar: 'https://example.com/avatar.jpg',
          website: 'https://johndoe.dev',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          twitter: 'https://twitter.com/johndoe',
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
          timezone: 'Europe/Kiev',
          preferences: {
            language: 'en',
            theme: 'light'
          }
        },
        notifications: {
          email: {
            enabled: true,
            frequency: 'immediate',
            types: ['job_alerts', 'messages', 'security']
          },
          push: {
            enabled: true,
            frequency: 'immediate',
            types: ['job_alerts', 'messages']
          }
        },
        privacy: {
          profileVisibility: 'public',
          contactInfoVisibility: 'friends',
          showOnlineStatus: true,
          allowMessagesFromStrangers: true
        },
        appearance: {
          theme: 'light',
          language: 'en',
          timezone: 'Europe/Kiev'
        },
        security: {
          twoFactorEnabled: false,
          loginAlerts: true,
          deviceAlerts: true,
          locationAlerts: false,
          trustedDevices: [],
          trustedIPs: [],
          sessionTimeout: 30,
          requirePasswordChange: false,
          passwordExpiryDate: null
        },
        preferences: {
          language: 'en',
          theme: 'light'
        }
      }
    }
  },

  // ===== ОНОВЛЕННЯ ПРОФІЛЮ =====
  
  /**
   * Оновлення профілю користувача
   */
  updateProfile: {
    method: 'PUT',
    url: '/api/settings/profile',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Senior Software Developer with expertise in modern web technologies',
      location: 'Kyiv, Ukraine',
      city: 'Kyiv',
      country: 'Ukraine',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
      timezone: 'Europe/Kiev'
    },
    response: {
      success: true,
      message: 'Profile updated successfully',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+380501234567',
        location: 'Kyiv, Ukraine',
        city: 'Kyiv',
        country: 'Ukraine',
        bio: 'Senior Software Developer with expertise in modern web technologies',
        avatar: 'https://example.com/avatar.jpg',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
        timezone: 'Europe/Kiev',
        preferences: {
          language: 'en',
          theme: 'light'
        },
        updatedAt: '2024-01-15T10:30:00Z'
      }
    }
  },

  // ===== НАЛАШТУВАННЯ СПОВІЩЕНЬ =====
  
  /**
   * Оновлення налаштувань сповіщень
   */
  updateNotificationSettings: {
    method: 'PUT',
    url: '/api/settings/notifications',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      email: {
        enabled: true,
        frequency: 'immediate',
        types: ['job_alerts', 'messages', 'security', 'marketing']
      },
      push: {
        enabled: true,
        frequency: 'immediate',
        types: ['job_alerts', 'messages']
      },
      sms: {
        enabled: false,
        frequency: 'never',
        types: []
      },
      jobAlerts: {
        enabled: true,
        frequency: 'daily',
        keywords: ['React', 'Node.js', 'TypeScript'],
        locations: ['Kyiv', 'Remote'],
        salaryMin: 2000,
        salaryMax: 5000,
        jobTypes: ['full-time', 'contract'],
        workModes: ['remote', 'hybrid']
      },
      securityAlerts: {
        enabled: true,
        frequency: 'immediate',
        loginAlerts: true,
        deviceAlerts: true,
        locationAlerts: false,
        passwordChangeAlerts: true,
        suspiciousActivityAlerts: true
      }
    },
    response: {
      success: true,
      message: 'Notification settings updated successfully',
      data: {
        email: {
          enabled: true,
          frequency: 'immediate',
          types: ['job_alerts', 'messages', 'security', 'marketing']
        },
        push: {
          enabled: true,
          frequency: 'immediate',
          types: ['job_alerts', 'messages']
        },
        sms: {
          enabled: false,
          frequency: 'never',
          types: []
        },
        jobAlerts: {
          enabled: true,
          frequency: 'daily',
          keywords: ['React', 'Node.js', 'TypeScript'],
          locations: ['Kyiv', 'Remote'],
          salaryMin: 2000,
          salaryMax: 5000,
          jobTypes: ['full-time', 'contract'],
          workModes: ['remote', 'hybrid']
        },
        securityAlerts: {
          enabled: true,
          frequency: 'immediate',
          loginAlerts: true,
          deviceAlerts: true,
          locationAlerts: false,
          passwordChangeAlerts: true,
          suspiciousActivityAlerts: true
        }
      }
    }
  },

  // ===== НАЛАШТУВАННЯ ПРИВАТНОСТІ =====
  
  /**
   * Оновлення налаштувань приватності
   */
  updatePrivacySettings: {
    method: 'PUT',
    url: '/api/settings/privacy',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      profileVisibility: 'public',
      contactInfoVisibility: 'friends',
      skillsVisibility: 'public',
      experienceVisibility: 'public',
      educationVisibility: 'friends',
      showOnlineStatus: true,
      showLastSeen: true,
      showLocation: true,
      showEmail: false,
      showPhone: false,
      showWebsite: true,
      showSocialLinks: true,
      allowMessagesFromStrangers: true,
      allowProfileViews: true,
      allowSearchEngines: true,
      blockedUsers: [],
      restrictedUsers: []
    },
    response: {
      success: true,
      message: 'Privacy settings updated successfully',
      data: {
        profileVisibility: 'public',
        contactInfoVisibility: 'friends',
        skillsVisibility: 'public',
        experienceVisibility: 'public',
        educationVisibility: 'friends',
        showOnlineStatus: true,
        showLastSeen: true,
        showLocation: true,
        showEmail: false,
        showPhone: false,
        showWebsite: true,
        showSocialLinks: true,
        allowMessagesFromStrangers: true,
        allowProfileViews: true,
        allowSearchEngines: true,
        blockedUsers: [],
        restrictedUsers: []
      }
    }
  },

  // ===== НАЛАШТУВАННЯ ЗОВНІШНЬОГО ВИГЛЯДУ =====
  
  /**
   * Оновлення налаштувань зовнішнього вигляду
   */
  updateAppearanceSettings: {
    method: 'PUT',
    url: '/api/settings/appearance',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      theme: 'dark',
      language: 'en',
      timezone: 'Europe/Kiev',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#1F2937',
        text: '#F9FAFB',
        border: '#374151'
      },
      fonts: {
        family: 'Inter',
        size: 14,
        weight: '400'
      },
      layout: {
        sidebar: 'left',
        header: 'fixed',
        footer: 'visible',
        density: 'comfortable'
      },
      animations: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out'
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false
      }
    },
    response: {
      success: true,
      message: 'Appearance settings updated successfully',
      data: {
        theme: 'dark',
        language: 'en',
        timezone: 'Europe/Kiev',
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#F59E0B',
          background: '#1F2937',
          text: '#F9FAFB',
          border: '#374151'
        },
        fonts: {
          family: 'Inter',
          size: 14,
          weight: '400'
        },
        layout: {
          sidebar: 'left',
          header: 'fixed',
          footer: 'visible',
          density: 'comfortable'
        },
        animations: {
          enabled: true,
          duration: 300,
          easing: 'ease-in-out'
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          screenReader: false
        }
      }
    }
  },

  // ===== НАЛАШТУВАННЯ БЕЗПЕКИ =====
  
  /**
   * Оновлення налаштувань безпеки
   */
  updateSecuritySettings: {
    method: 'PUT',
    url: '/api/settings/security',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      twoFactorEnabled: true,
      loginAlerts: true,
      deviceAlerts: true,
      locationAlerts: true,
      sessionTimeout: 60,
      requirePasswordChange: false,
      requireStrongPassword: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      allowConcurrentSessions: true,
      maxConcurrentSessions: 3,
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventReuse: 5
      }
    },
    response: {
      success: true,
      message: 'Security settings updated successfully',
      data: {
        twoFactorEnabled: true,
        loginAlerts: true,
        deviceAlerts: true,
        locationAlerts: true,
        sessionTimeout: 60,
        requirePasswordChange: false,
        requireStrongPassword: true,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        allowConcurrentSessions: true,
        maxConcurrentSessions: 3,
        passwordPolicy: {
          minLength: 12,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          preventReuse: 5
        }
      }
    }
  },

  // ===== ЗМІНА ПАРОЛЯ =====
  
  /**
   * Зміна пароля
   */
  changePassword: {
    method: 'PUT',
    url: '/api/settings/password',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      currentPassword: 'oldPassword123',
      newPassword: 'newSecurePassword456!',
      confirmPassword: 'newSecurePassword456!'
    },
    response: {
      success: true,
      message: 'Password changed successfully'
    }
  },

  // ===== ЖУРНАЛ БЕЗПЕКИ =====
  
  /**
   * Отримання журналу безпеки
   */
  getSecurityLog: {
    method: 'GET',
    url: '/api/settings/security-log',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    query: {
      page: 1,
      limit: 20,
      action: 'login',
      success: true,
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    },
    response: {
      success: true,
      message: 'Security log retrieved successfully',
      data: {
        entries: [
          {
            id: '1',
            userId: 'user-uuid-1',
            action: 'login',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            location: 'Kyiv, Ukraine',
            success: true,
            details: {
              loginMethod: 'email',
              deviceType: 'desktop',
              browser: 'Chrome',
              os: 'Windows'
            },
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            userId: 'user-uuid-1',
            action: 'password_change',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            location: 'Kyiv, Ukraine',
            success: true,
            details: {
              passwordChangedAt: '2024-01-15T10:30:00Z'
            },
            createdAt: '2024-01-15T10:30:00Z'
          }
        ],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  },

  // ===== УПРАВЛІННЯ СЕСІЯМИ =====
  
  /**
   * Отримання активних сесій
   */
  getActiveSessions: {
    method: 'GET',
    url: '/api/settings/sessions',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    query: {
      page: 1,
      limit: 20,
      active: true,
      sortBy: 'lastActivity',
      sortOrder: 'DESC'
    },
    response: {
      success: true,
      message: 'Active sessions retrieved successfully',
      data: {
        sessions: [
          {
            id: 'session-1',
            deviceName: 'Chrome on Windows',
            deviceType: 'desktop',
            ipAddress: '192.168.1.1',
            location: 'Kyiv, Ukraine',
            lastActivity: '2024-01-15T10:30:00Z',
            isActive: true,
            createdAt: '2024-01-15T09:00:00Z'
          },
          {
            id: 'session-2',
            deviceName: 'Safari on iPhone',
            deviceType: 'mobile',
            ipAddress: '192.168.1.2',
            location: 'Lviv, Ukraine',
            lastActivity: '2024-01-15T09:30:00Z',
            isActive: true,
            createdAt: '2024-01-15T08:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  },

  /**
   * Завершення сесії
   */
  terminateSession: {
    method: 'DELETE',
    url: '/api/settings/sessions/session-2',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    response: {
      success: true,
      message: 'Session terminated successfully'
    }
  },

  /**
   * Завершення всіх сесій
   */
  terminateAllSessions: {
    method: 'DELETE',
    url: '/api/settings/sessions',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      reason: 'Security concern',
      keepCurrent: true
    },
    response: {
      success: true,
      message: 'All sessions terminated successfully'
    }
  },

  // ===== УПРАВЛІННЯ ДОВІРЕНИМИ ПРИСТРОЯМИ =====
  
  /**
   * Додавання довіреного пристрою
   */
  addTrustedDevice: {
    method: 'POST',
    url: '/api/settings/trusted-devices',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      deviceName: 'My MacBook Pro',
      deviceType: 'desktop',
      deviceId: 'device-uuid-1',
      description: 'Personal laptop'
    },
    response: {
      success: true,
      message: 'Trusted device added successfully',
      data: {
        id: 'device-uuid-1',
        name: 'My MacBook Pro',
        type: 'desktop',
        description: 'Personal laptop',
        addedAt: '2024-01-15T10:30:00Z',
        lastUsed: '2024-01-15T10:30:00Z'
      }
    }
  },

  /**
   * Видалення довіреного пристрою
   */
  removeTrustedDevice: {
    method: 'DELETE',
    url: '/api/settings/trusted-devices/device-uuid-1',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    response: {
      success: true,
      message: 'Trusted device removed successfully'
    }
  },

  // ===== УПРАВЛІННЯ ДОВІРЕНИМИ IP АДРЕСАМИ =====
  
  /**
   * Додавання довіреної IP адреси
   */
  addTrustedIP: {
    method: 'POST',
    url: '/api/settings/trusted-ips',
    headers: {
      'Authorization': 'Bearer your-jwt-token',
      'Content-Type': 'application/json'
    },
    body: {
      ipAddress: '192.168.1.100',
      description: 'Home network',
      location: 'Kyiv, Ukraine'
    },
    response: {
      success: true,
      message: 'Trusted IP added successfully',
      data: {
        id: 'ip-1642248600000',
        address: '192.168.1.100',
        description: 'Home network',
        location: 'Kyiv, Ukraine',
        addedAt: '2024-01-15T10:30:00Z'
      }
    }
  },

  /**
   * Видалення довіреної IP адреси
   */
  removeTrustedIP: {
    method: 'DELETE',
    url: '/api/settings/trusted-ips/ip-1642248600000',
    headers: {
      'Authorization': 'Bearer your-jwt-token'
    },
    response: {
      success: true,
      message: 'Trusted IP removed successfully'
    }
  }
};

export default settingsExamples;


