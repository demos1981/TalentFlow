import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import { AppDataSource } from './database';
import dotenv from 'dotenv';

// Завантажуємо environment variables
dotenv.config();

// Розширюємо тип Profile для Google
interface GoogleProfile extends passport.Profile {
  id: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  name: {
    givenName: string;
    familyName: string;
  };
  photos?: Array<{ value: string }>;
  _json?: {
    email?: string;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
  };
}

export const configureGoogleStrategy = () => {
  // Перевіряємо наявність Google credentials
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientID) {
    console.error('❌ GOOGLE_CLIENT_ID не знайдено в environment variables');
    throw new Error('GOOGLE_CLIENT_ID is required');
  }
  
  if (!clientSecret) {
    console.error('❌ GOOGLE_CLIENT_SECRET не знайдено в environment variables');
    throw new Error('GOOGLE_CLIENT_SECRET is required');
  }

  passport.use('google', new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? "https://talentflow-production-50cc.up.railway.app/api/auth/google/callback"
      : "http://localhost:3002/api/auth/google/callback",
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleProfile = profile as GoogleProfile;
      const userRepository = AppDataSource.getRepository(User);
      
      // Шукаємо користувача за Google ID
      let user = await userRepository.findOne({ 
        where: { googleId: googleProfile.id } 
      });
      
      if (!user) {
        // Шукаємо користувача за email
        if (googleProfile.emails && googleProfile.emails.length > 0) {
          user = await userRepository.findOne({ 
            where: { email: googleProfile.emails[0].value } 
          });
        }
        
        if (!user) {
          // Користувач не знайдений - потрібна реєстрація
          console.log('❌ User not found. Please register first:', googleProfile.emails?.[0]?.value);
          return done(null, { error: 'user_not_found', email: googleProfile.emails?.[0]?.value });
        } else {
          // Оновлюємо існуючого користувача з Google ID
          user.googleId = googleProfile.id;
          if (googleProfile.photos?.[0]?.value) {
            user.avatar = googleProfile.photos[0].value;
          }
          await userRepository.save(user);
        }
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
};
