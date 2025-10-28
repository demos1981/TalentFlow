// Розширення типів Express для додавання req.user, params, query
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
      company_id?: string;
    };
    params: any;
    query: any;
  }
}
