import jwt from 'jsonwebtoken';

export const getAuthHeader = (userId: string) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!JWT_SECRET_KEY) throw new Error('Test server configuration error, missing JWT signing key.');

  const payload = {
    sub: userId,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY);
  return {
    Authorization: `Bearer ${token}`,
  };
};
