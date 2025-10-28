import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { User } from '../models/User';
import { AppDataSource } from './database';
import dotenv from 'dotenv';
import axios from 'axios';

// Завантажуємо environment variables
dotenv.config();

// Розширюємо тип Profile для LinkedIn
interface LinkedInProfile extends passport.Profile {
  id: string;
  emails?: Array<{ value: string; type?: string }>;
  name: {
    givenName: string;
    familyName: string;
    middleName?: string;
  };
  photos?: Array<{ value: string }>;
  _json?: {
    email?: string;
    given_name?: string;
    family_name?: string;
  };
}

export const configureLinkedInStrategy = () => {
  // Перевіряємо наявність LinkedIn credentials
  const clientID = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  
  if (!clientID) {
    console.error('❌ LINKEDIN_CLIENT_ID не знайдено в environment variables');
    throw new Error('LINKEDIN_CLIENT_ID is required');
  }
  
  if (!clientSecret) {
    console.error('❌ LINKEDIN_CLIENT_SECRET не знайдено в environment variables');
    throw new Error('LINKEDIN_CLIENT_SECRET is required');
  }

  passport.use('linkedin', new OAuth2Strategy({
    authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? "https://talentflow-production-50cc.up.railway.app/api/auth/linkedin/callback"
      : "http://localhost:3002/api/auth/linkedin/callback",
    scope: ['openid', 'profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Отримуємо профіль користувача через LinkedIn API
      const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const linkedinProfile = profileResponse.data;
      const userRepository = AppDataSource.getRepository(User);
      
      // OpenID Connect використовує sub
      const linkedinId = linkedinProfile.sub;
      
      let user = await userRepository.findOne({ 
        where: { linkedinId } 
      });
      
      if (user) {
        // Оновлюємо існуючого користувача з LinkedIn профілю
        if (linkedinProfile.picture) {
          user.avatar = linkedinProfile.picture;
        }
        if (linkedinProfile.given_name) {
          user.firstName = linkedinProfile.given_name;
        }
        if (linkedinProfile.family_name) {
          user.lastName = linkedinProfile.family_name;
        }
        await userRepository.save(user);
      } else if (!user) {
        // Шукаємо користувача за email
        user = await userRepository.findOne({ 
          where: { email: linkedinProfile.email } 
        });
        
        if (!user) {
          // Користувач не знайдений - потрібна реєстрація
          console.log('❌ User not found. Please register first:', linkedinProfile.email);
          return done(null, { error: 'user_not_found', email: linkedinProfile.email });
        } else {
          // Оновлюємо існуючого користувача з LinkedIn ID
          user.linkedinId = linkedinProfile.sub;
          if (linkedinProfile.picture) {
            user.avatar = linkedinProfile.picture;
          }
          // Оновлюємо ім'я з LinkedIn профілю
          if (linkedinProfile.given_name) {
            user.firstName = linkedinProfile.given_name;
          }
          if (linkedinProfile.family_name) {
            user.lastName = linkedinProfile.family_name;
          }
          await userRepository.save(user);
        }
      }
      
      return done(null, user);
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      return done(error, null);
    }
  }));
};
