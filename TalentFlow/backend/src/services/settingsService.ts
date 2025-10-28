import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { CandidateProfile } from '../models/CandidateProfile';
import {
  UpdateProfileDto,
  UpdateNotificationSettingsDto,
  UpdatePrivacySettingsDto,
  UpdateAppearanceSettingsDto,
  UpdateSecuritySettingsDto,
  ChangePasswordDto,
  SecurityLogSearchDto,
  SessionManagementDto,
  TerminateAllSessionsDto,
  AddTrustedDeviceDto,
  AddTrustedIPDto} from '../dto/SettingsDto';
import bcrypt from 'bcryptjs';

export interface UserSettings {
  profile: any;
  notifications: any;
  privacy: any;
  appearance: any;
  security: any;
  preferences: any;
}

export interface SecurityLogEntry {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
  details?: any;
  createdAt: Date;
}

export interface SessionInfo {
  id: string;
  deviceName: string;
  deviceType: string;
  ipAddress: string;
  location?: string;
  lastActivity: Date;
  isActive: boolean;
  createdAt: Date;
}

export class SettingsService {
  private userRepository: Repository<User>;
  private candidateProfileRepository: Repository<CandidateProfile>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.candidateProfileRepository = AppDataSource.getRepository(CandidateProfile);
  }

  /**
   * Отримання всіх налаштувань користувача
   */
  async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      const user = await this.userRepository.findOne({ 
        where: { id: userId },
        relations: ['candidateProfile']
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          location: user.location,
          city: user.city,
          country: user.country,
          bio: user.bio,
          avatar: user.avatar,
          website: user.website,
          linkedin: user.linkedin,
          github: user.github,
          twitter: user.twitter,
          skills: user.skills,
          timezone: user.timezone,
          preferences: user.preferences
        },
        notifications: user.notificationSettings || {},
        privacy: user.privacySettings || {},
        appearance: user.appearanceSettings || {},
        security: {
          twoFactorEnabled: user.twoFactorEnabled,
          loginAlerts: user.loginAlerts,
          deviceAlerts: user.deviceAlerts,
          locationAlerts: user.locationAlerts,
          trustedDevices: user.trustedDevices || [],
          trustedIPs: user.trustedIPs || [],
          sessionTimeout: user.sessionTimeout,
          requirePasswordChange: user.requirePasswordChange,
          passwordExpiryDate: user.passwordExpiryDate
        },
        preferences: user.preferences || {}
      };
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw new Error(`Failed to get user settings: ${error.message}`);
    }
  }

  /**
   * Оновлення профілю користувача
   */
  async updateProfile(userId: string, profileData: UpdateProfileDto, req: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ 
        where: { id: userId },
        relations: ['candidateProfile']
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      // Оновлюємо поля профілю
      if (profileData.firstName !== undefined) user.firstName = profileData.firstName;
      if (profileData.lastName !== undefined) user.lastName = profileData.lastName;
      if (profileData.email !== undefined) user.email = profileData.email;
      if (profileData.phone !== undefined) user.phone = profileData.phone;
      if (profileData.location !== undefined) user.location = profileData.location;
      if (profileData.city !== undefined) user.city = profileData.city;
      if (profileData.country !== undefined) user.country = profileData.country;
      if (profileData.bio !== undefined) user.bio = profileData.bio;
      if (profileData.avatar !== undefined) user.avatar = profileData.avatar;
      if (profileData.website !== undefined) user.website = profileData.website;
      if (profileData.linkedin !== undefined) user.linkedin = profileData.linkedin;
      if (profileData.facebook !== undefined) user.facebook = profileData.facebook;
      if (profileData.github !== undefined) user.github = profileData.github;
      if (profileData.twitter !== undefined) user.twitter = profileData.twitter;
      if (profileData.title !== undefined) user.title = profileData.title;
      if (profileData.companyName !== undefined) user.companyName = profileData.companyName;
      if (profileData.skills !== undefined) user.skills = profileData.skills;
      if (profileData.timezone !== undefined) user.timezone = profileData.timezone;
      if (profileData.preferences !== undefined) user.preferences = profileData.preferences;

      user.updatedAt = new Date();
      await this.userRepository.save(user);

      // Оновлюємо профіль кандидата, якщо він існує
      if (user.profiles && user.profiles.length > 0) {
        const candidateProfile = user.profiles[0];
        if (profileData.bio !== undefined) candidateProfile.bio = profileData.bio;
        if (profileData.website !== undefined) candidateProfile.website = profileData.website;
        if (profileData.linkedin !== undefined) candidateProfile.linkedin = profileData.linkedin;
        if (profileData.github !== undefined) candidateProfile.github = profileData.github;
        if (profileData.skills !== undefined) candidateProfile.skills = profileData.skills;
        if (profileData.location !== undefined) candidateProfile.location = profileData.location;
        // city and country not in CandidateProfile model
        
        candidateProfile.updatedAt = new Date();
        await this.candidateProfileRepository.save(candidateProfile);
      }

      // Логуємо зміну профілю
      await this.logSecurityAction(userId, 'profile_update', req.ip, req.headers['user-agent'], true, { 
        updatedFields: Object.keys(profileData) 
      });

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        city: user.city,
        country: user.country,
        bio: user.bio,
        avatar: user.avatar,
        website: user.website,
        linkedin: user.linkedin,
        github: user.github,
        twitter: user.twitter,
        skills: user.skills,
        timezone: user.timezone,
        preferences: user.preferences,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * Оновлення налаштувань сповіщень
   */
  async updateNotificationSettings(userId: string, notificationSettings: UpdateNotificationSettingsDto, req: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      user.notificationSettings = {
        ...user.notificationSettings,
        ...notificationSettings
      };
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      // Логуємо зміну налаштувань сповіщень
      await this.logSecurityAction(userId, 'notification_settings_update', req.ip, req.headers['user-agent'], true, { 
        updatedSettings: Object.keys(notificationSettings) 
      });

      return user.notificationSettings;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw new Error(`Failed to update notification settings: ${error.message}`);
    }
  }

  /**
   * Оновлення налаштувань приватності
   */
  async updatePrivacySettings(userId: string, privacySettings: UpdatePrivacySettingsDto, req: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      user.privacySettings = {
        ...user.privacySettings,
        ...privacySettings
      };
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      // Логуємо зміну налаштувань приватності
      await this.logSecurityAction(userId, 'privacy_settings_update', req.ip, req.headers['user-agent'], true, { 
        updatedSettings: Object.keys(privacySettings) 
      });

      return user.privacySettings;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw new Error(`Failed to update privacy settings: ${error.message}`);
    }
  }

  /**
   * Оновлення налаштувань зовнішнього вигляду
   */
  async updateAppearanceSettings(userId: string, appearanceSettings: UpdateAppearanceSettingsDto, req: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      user.appearanceSettings = {
        ...user.appearanceSettings,
        ...appearanceSettings
      };
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      // Логуємо зміну налаштувань зовнішнього вигляду
      await this.logSecurityAction(userId, 'appearance_settings_update', req.ip, req.headers['user-agent'], true, { 
        updatedSettings: Object.keys(appearanceSettings) 
      });

      return user.appearanceSettings;
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      throw new Error(`Failed to update appearance settings: ${error.message}`);
    }
  }

  /**
   * Оновлення налаштувань безпеки
   */
  async updateSecuritySettings(userId: string, securitySettings: UpdateSecuritySettingsDto, req: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Оновлюємо налаштування безпеки
      if (securitySettings.twoFactorEnabled !== undefined) user.twoFactorEnabled = securitySettings.twoFactorEnabled;
      if (securitySettings.loginAlerts !== undefined) user.loginAlerts = securitySettings.loginAlerts;
      if (securitySettings.deviceAlerts !== undefined) user.deviceAlerts = securitySettings.deviceAlerts;
      if (securitySettings.locationAlerts !== undefined) user.locationAlerts = securitySettings.locationAlerts;
      if (securitySettings.trustedDevices !== undefined) user.trustedDevices = securitySettings.trustedDevices;
      if (securitySettings.trustedIPs !== undefined) user.trustedIPs = securitySettings.trustedIPs;
      if (securitySettings.sessionTimeout !== undefined) user.sessionTimeout = securitySettings.sessionTimeout;
      if (securitySettings.requirePasswordChange !== undefined) user.requirePasswordChange = securitySettings.requirePasswordChange;
      if (securitySettings.passwordExpiryDate !== undefined) user.passwordExpiryDate = new Date(securitySettings.passwordExpiryDate);

      user.updatedAt = new Date();
      await this.userRepository.save(user);

      // Логуємо зміну налаштувань безпеки
      await this.logSecurityAction(userId, 'security_settings_update', req.ip, req.headers['user-agent'], true, { 
        updatedSettings: Object.keys(securitySettings) 
      });

      return {
        twoFactorEnabled: user.twoFactorEnabled,
        loginAlerts: user.loginAlerts,
        deviceAlerts: user.deviceAlerts,
        locationAlerts: user.locationAlerts,
        trustedDevices: user.trustedDevices,
        trustedIPs: user.trustedIPs,
        sessionTimeout: user.sessionTimeout,
        requirePasswordChange: user.requirePasswordChange,
        passwordExpiryDate: user.passwordExpiryDate
      };
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw new Error(`Failed to update security settings: ${error.message}`);
    }
  }

  /**
   * Зміна пароля
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto, req: any): Promise<void> {
    try {
      const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Перевіряємо поточний пароль
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        await this.logSecurityAction(userId, 'password_change_attempt', req.ip, req.headers['user-agent'], false, { 
          reason: 'invalid_current_password' 
        });
        throw new Error('Current password is incorrect');
      }

      // Хешуємо новий пароль
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Оновлюємо пароль
      user.password = hashedNewPassword;
      user.passwordChangedAt = new Date();
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      // Логуємо успішну зміну пароля
      await this.logSecurityAction(userId, 'password_change', req.ip, req.headers['user-agent'], true, { 
        passwordChangedAt: user.passwordChangedAt 
      });
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  /**
   * Завершення сесії
   */
  async terminateSession(userId: string, sessionId: string, req: any): Promise<void> {
    try {
      // TODO: Implement session termination logic
      // This would typically involve removing the session from a session store
      // For now, we'll just log the action
      
      await this.logSecurityAction(userId, 'session_terminated', req.ip, req.headers['user-agent'], true, { 
        sessionId 
      });
    } catch (error) {
      console.error('Error terminating session:', error);
      throw new Error(`Failed to terminate session: ${error.message}`);
    }
  }

  /**
   * Отримання журналу безпеки
   */
  async getSecurityLog(userId: string, searchDto: SecurityLogSearchDto): Promise<{
    entries: SecurityLogEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        action,
        success,
        ipAddress,
        location,
        dateFrom,
        dateTo,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = searchDto;

      // Get user data for security log
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Create security log entries from user data
      const entries: SecurityLogEntry[] = [];

      // Add login activity
      if (user.lastLoginAt) {
        entries.push({
          id: `login-${user.id}`,
          userId,
          action: 'login',
          ipAddress: 'Unknown', // Would need to track this separately
          userAgent: 'Unknown', // Would need to track this separately
          location: user.location || 'Unknown',
          success: true,
          details: { 
            loginMethod: user.googleId ? 'google' : user.linkedinId ? 'linkedin' : 'email',
            lastLoginAt: user.lastLoginAt
          },
          createdAt: user.lastLoginAt
        });
      }

      // Add password change activity
      if (user.passwordChangedAt) {
        entries.push({
          id: `password-${user.id}`,
          userId,
          action: 'password_change',
          ipAddress: 'Unknown',
          userAgent: 'Unknown',
          location: user.location || 'Unknown',
          success: true,
          details: { 
            passwordChangedAt: user.passwordChangedAt,
            requirePasswordChange: user.requirePasswordChange
          },
          createdAt: user.passwordChangedAt
        });
      }

      // Add account creation
      entries.push({
        id: `account-${user.id}`,
        userId,
        action: 'account_created',
        ipAddress: 'Unknown',
        userAgent: 'Unknown',
        location: user.location || 'Unknown',
        success: true,
        details: { 
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled
        },
        createdAt: user.createdAt
      });

      // Add email verification if verified
      if (user.emailVerified && user.emailVerifiedAt) {
        entries.push({
          id: `email-verify-${user.id}`,
          userId,
          action: 'email_verified',
          ipAddress: 'Unknown',
          userAgent: 'Unknown',
          location: user.location || 'Unknown',
          success: true,
          details: { 
            emailVerifiedAt: user.emailVerifiedAt
          },
          createdAt: user.emailVerifiedAt
        });
      }

      // Add last activity
      if (user.lastActiveAt) {
        entries.push({
          id: `activity-${user.id}`,
          userId,
          action: 'last_activity',
          ipAddress: 'Unknown',
          userAgent: 'Unknown',
          location: user.location || 'Unknown',
          success: true,
          details: { 
            lastActiveAt: user.lastActiveAt
          },
          createdAt: user.lastActiveAt
        });
      }

      // Apply filters
      let filteredEntries = entries;

      if (action) {
        filteredEntries = filteredEntries.filter(entry => entry.action === action);
      }

      if (success !== undefined) {
        filteredEntries = filteredEntries.filter(entry => entry.success === success);
      }

      if (dateFrom) {
        filteredEntries = filteredEntries.filter(entry => entry.createdAt >= new Date(dateFrom));
      }

      if (dateTo) {
        filteredEntries = filteredEntries.filter(entry => entry.createdAt <= new Date(dateTo));
      }

      if (search) {
        filteredEntries = filteredEntries.filter(entry => 
          entry.action.toLowerCase().includes(search.toLowerCase()) ||
          entry.location.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Sort entries
      filteredEntries.sort((a, b) => {
        const aValue = a[sortBy as keyof SecurityLogEntry];
        const bValue = b[sortBy as keyof SecurityLogEntry];
        
        if (sortOrder === 'ASC') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const total = filteredEntries.length;
      const totalPages = Math.ceil(total / limit);
      const paginatedEntries = filteredEntries.slice((page - 1) * limit, page * limit);

      return {
        entries: paginatedEntries,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error getting security log:', error);
      throw new Error(`Failed to get security log: ${error.message}`);
    }
  }

  /**
   * Отримання активних сесій
   */
  async getActiveSessions(userId: string, sessionDto: SessionManagementDto): Promise<{
    sessions: SessionInfo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        active,
        device,
        location,
        sortBy = 'lastActivity',
        sortOrder = 'DESC'
      } = sessionDto;

      // Get user data for session info
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Create session info from user data
      const sessions: SessionInfo[] = [];

      // Current session (based on last activity)
      if (user.lastActiveAt) {
        const isActive = user.lastActiveAt > new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
        sessions.push({
          id: `current-${user.id}`,
          deviceName: 'Current Device',
          deviceType: 'unknown',
          ipAddress: 'Unknown',
          location: user.location || 'Unknown',
          lastActivity: user.lastActiveAt,
          isActive,
          createdAt: user.createdAt
        });
      }

      // Login session (based on last login)
      if (user.lastLoginAt) {
        const isActive = user.lastLoginAt > new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
        sessions.push({
          id: `login-${user.id}`,
          deviceName: 'Login Device',
          deviceType: 'unknown',
          ipAddress: 'Unknown',
          location: user.location || 'Unknown',
          lastActivity: user.lastLoginAt,
          isActive,
          createdAt: user.lastLoginAt
        });
      }

      // Account creation session
      sessions.push({
        id: `account-${user.id}`,
        deviceName: 'Registration Device',
        deviceType: 'unknown',
        ipAddress: 'Unknown',
        location: user.location || 'Unknown',
        lastActivity: user.createdAt,
        isActive: false,
        createdAt: user.createdAt
      });

      // Apply filters
      let filteredSessions = sessions;

      if (active !== undefined) {
        filteredSessions = filteredSessions.filter(session => session.isActive === active);
      }

      if (device) {
        filteredSessions = filteredSessions.filter(session => 
          session.deviceName.toLowerCase().includes(device.toLowerCase()) ||
          session.deviceType.toLowerCase().includes(device.toLowerCase())
        );
      }

      if (location) {
        filteredSessions = filteredSessions.filter(session => 
          session.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Sort sessions
      filteredSessions.sort((a, b) => {
        const aValue = a[sortBy as keyof SessionInfo];
        const bValue = b[sortBy as keyof SessionInfo];
        
        if (sortOrder === 'ASC') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const total = filteredSessions.length;
      const totalPages = Math.ceil(total / limit);
      const paginatedSessions = filteredSessions.slice((page - 1) * limit, page * limit);

      return {
        sessions: paginatedSessions,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error getting active sessions:', error);
      throw new Error(`Failed to get active sessions: ${error.message}`);
    }
  }

  /**
   * Завершення всіх сесій
   */
  async terminateAllSessions(userId: string, terminateDto: TerminateAllSessionsDto, req: any): Promise<void> {
    try {
      const { reason, keepCurrent = true } = terminateDto;

      // TODO: Implement actual session termination logic
      // This would typically involve removing sessions from a session store
      
      await this.logSecurityAction(userId, 'all_sessions_terminated', req.ip, req.headers['user-agent'], true, { 
        reason,
        keepCurrent 
      });
    } catch (error) {
      console.error('Error terminating all sessions:', error);
      throw new Error(`Failed to terminate all sessions: ${error.message}`);
    }
  }

  /**
   * Додавання довіреного пристрою
   */
  async addTrustedDevice(userId: string, deviceDto: AddTrustedDeviceDto, req: any): Promise<any> {
    try {
      const { deviceName, deviceType, deviceId, description } = deviceDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const trustedDevices = user.trustedDevices || [];
      const newDevice = {
        id: deviceId,
        name: deviceName,
        type: deviceType,
        description,
        addedAt: new Date(),
        lastUsed: new Date()
      };

      trustedDevices.push(newDevice);
      user.trustedDevices = trustedDevices;
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      await this.logSecurityAction(userId, 'device_added', req.ip, req.headers['user-agent'], true, { 
        deviceId,
        deviceName,
        deviceType 
      });

      return newDevice;
    } catch (error) {
      console.error('Error adding trusted device:', error);
      throw new Error(`Failed to add trusted device: ${error.message}`);
    }
  }

  /**
   * Видалення довіреного пристрою
   */
  async removeTrustedDevice(userId: string, deviceId: string, req: any): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const trustedDevices = user.trustedDevices || [];
      const deviceIndex = trustedDevices.findIndex(device => device.id === deviceId);
      
      if (deviceIndex === -1) {
        throw new Error('Device not found');
      }

      const removedDevice = trustedDevices[deviceIndex];
      trustedDevices.splice(deviceIndex, 1);
      
      user.trustedDevices = trustedDevices;
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      await this.logSecurityAction(userId, 'device_removed', req.ip, req.headers['user-agent'], true, { 
        deviceId,
        deviceName: removedDevice.name 
      });
    } catch (error) {
      console.error('Error removing trusted device:', error);
      throw new Error(`Failed to remove trusted device: ${error.message}`);
    }
  }

  /**
   * Додавання довіреної IP адреси
   */
  async addTrustedIP(userId: string, ipDto: AddTrustedIPDto, req: any): Promise<any> {
    try {
      const { ipAddress, description, location } = ipDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const trustedIPs = user.trustedIPs || [];
      const newIP = {
        id: `ip-${Date.now()}`,
        address: ipAddress,
        description,
        location,
        addedAt: new Date()
      };

      trustedIPs.push(newIP);
      user.trustedIPs = trustedIPs;
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      await this.logSecurityAction(userId, 'ip_added', req.ip, req.headers['user-agent'], true, { 
        ipAddress,
        description,
        location 
      });

      return newIP;
    } catch (error) {
      console.error('Error adding trusted IP:', error);
      throw new Error(`Failed to add trusted IP: ${error.message}`);
    }
  }

  /**
   * Видалення довіреної IP адреси
   */
  async removeTrustedIP(userId: string, ipId: string, req: any): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const trustedIPs = user.trustedIPs || [];
      const ipIndex = trustedIPs.findIndex(ip => ip.id === ipId);
      
      if (ipIndex === -1) {
        throw new Error('IP address not found');
      }

      const removedIP = trustedIPs[ipIndex];
      trustedIPs.splice(ipIndex, 1);
      
      user.trustedIPs = trustedIPs;
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      await this.logSecurityAction(userId, 'ip_removed', req.ip, req.headers['user-agent'], true, { 
        ipId,
        ipAddress: removedIP.address 
      });
    } catch (error) {
      console.error('Error removing trusted IP:', error);
      throw new Error(`Failed to remove trusted IP: ${error.message}`);
    }
  }

  /**
   * Логування дій безпеки
   */
  private async logSecurityAction(
    userId: string,
    action: string,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    details?: any
  ): Promise<void> {
    try {
      // TODO: Implement actual security logging to database
      // For now, just log to console
      console.log(`Security action: ${action} by user ${userId} from ${ipAddress}, success: ${success}`, details);
    } catch (error) {
      console.error('Error logging security action:', error);
    }
  }
}

export const settingsService = new SettingsService();