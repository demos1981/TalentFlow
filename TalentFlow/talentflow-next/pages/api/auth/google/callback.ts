import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Перенаправляємо запит на бекенд
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://talentflow-production-50cc.up.railway.app'
      : 'http://localhost:3002';
    
    const backendCallbackUrl = `${backendUrl}/api/auth/google/callback`;
    
    // Додаємо всі query параметри до URL бекенду
    const queryString = new URLSearchParams(req.query as any).toString();
    const fullBackendUrl = queryString 
      ? `${backendCallbackUrl}?${queryString}`
      : backendCallbackUrl;
    
    // Перенаправляємо на бекенд
    res.redirect(302, fullBackendUrl);
    
  } catch (error) {
    console.error('Google callback proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
