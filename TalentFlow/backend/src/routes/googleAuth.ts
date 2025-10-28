import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Початок OAuth flow
router.get('/auth/google', passport.authenticate('google'));

// Middleware для обробки помилок Passport
const handlePassportError = (err: any, req: any, res: any, next: any) => {
  if (err) {
    console.error('Passport error:', err);
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? 'https://talentfluent.net'
      : 'http://localhost:3000';
    
    if (err.message && err.message.includes('User not found')) {
      return res.redirect(`${frontendUrl}/auth/callback?error=user_not_found`);
    }
    
    // Обробляємо OAuth помилки
    if (err.code === 'invalid_grant') {
      return res.redirect(`${frontendUrl}/auth/callback?error=invalid_grant`);
    }
    
    if (err.code === 'access_denied') {
      return res.redirect(`${frontendUrl}/auth/callback?error=access_denied`);
    }
    
    return res.redirect(`${frontendUrl}/auth/callback?error=auth_failed`);
  }
  next();
};

// Callback після успішної авторизації
router.get('/auth/google/callback', 
  handlePassportError,
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?error=auth_failed`);
      }

      // Перевіряємо чи це помилка з стратегії
      if (user.error) {
        const frontendUrl = process.env.NODE_ENV === 'production'
          ? 'https://talentfluent.net'
          : 'http://localhost:3000';
        
        if (user.error === 'user_not_found') {
          return res.redirect(`${frontendUrl}/auth/callback?error=user_not_found`);
        }
        
        return res.redirect(`${frontendUrl}/auth/callback?error=auth_failed`);
      }

      // Генеруємо JWT токен
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Перенаправляємо на фронтенд з токеном (як LinkedIn)
      const frontendUrl = process.env.NODE_ENV === 'production'
        ? 'https://talentfluent.net'
        : 'http://localhost:3000';
        
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google`);
      
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = process.env.NODE_ENV === 'production'
        ? 'https://talentfluent.net'
        : 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?error=token_generation_failed`);
    }
  }
);

// Захищений роут для отримання профілю
router.get('/auth/google/profile', (req, res) => {
  // Тут має бути authenticateToken middleware
  res.json({ message: 'Google profile endpoint' });
});

export default router;
