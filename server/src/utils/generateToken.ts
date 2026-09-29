import jwt, { Secret } from 'jsonwebtoken';

export const generateToken = (id: string, role: 'customer' | 'admin'): string => {
  const secret: Secret = process.env.JWT_SECRET || 'glowcart_super_secret_jwt_key_2026_beauty_ecommerce';

  return jwt.sign({ id, role }, secret, {
    expiresIn: '7d'
  });
};
