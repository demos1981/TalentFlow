import { apiClient } from '../utils/apiClient';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  avatar?: string;
}

export interface NotificationSettings {
  email: {
    newApplications: boolean;
    interviewReminders: boolean;
    jobUpdates: boolean;
    systemUpdates: boolean;
    marketing: boolean;
  };
  push: {
    newApplications: boolean;
    interviewReminders: boolean;
    jobUpdates: boolean;
    systemUpdates: boolean;
    marketing: boolean;
  };
  sms: {
    urgentNotifications: boolean;
    interviewReminders: boolean;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  lastPasswordChange: string;
  activeSessions: Array<{
    id: number;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
    ip: string;
  }>;
}

export interface SecurityLogEntry {
  id: number;
  type: string;
  status: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  timestamp: string;
  ip: string;
  device: string;
  location: string;
}

export interface UserSettings {
  profile: UserProfile;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export class SettingsService {
  // Отримання налаштувань користувача
  static async getUserSettings(): Promise<UserSettings> {
    const response = await apiClient.get('/settings/user');
    return response.data.data;
  }

  // Оновлення профілю користувача
  static async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put('/settings/profile', profileData);
    return response.data.data;
  }

  // Оновлення налаштувань сповіщень
  static async updateNotificationSettings(notifications: NotificationSettings): Promise<NotificationSettings> {
    const response = await apiClient.put('/settings/notifications', { notifications });
    return response.data.data;
  }

  // Зміна пароля
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put('/settings/password', {
      currentPassword,
      newPassword
    });
  }

  // Завершення сесії
  static async terminateSession(sessionId: number): Promise<void> {
    await apiClient.delete(`/settings/sessions/${sessionId}`);
  }

  // Отримання журналу безпеки
  static async getSecurityLog(): Promise<SecurityLogEntry[]> {
    const response = await apiClient.get('/settings/security/log');
    return response.data.data;
  }
}

export default SettingsService;


