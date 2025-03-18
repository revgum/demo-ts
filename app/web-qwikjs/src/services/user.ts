import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

interface User {
  id: string;
  login: string;
  hashedPassword: string;
  salt: string;
}

// In-memory user store for demonstration purposes only.
const users: User[] = [
  {
    id: 'fca4e497-56ae-4202-810c-36cb606fb9df',
    login: 'test-user@test.com',
    hashedPassword: 'b462aa49df5296dacb4f063b9a94d44459fd2198560894187c77624f7ba8e70e', // password: asdfg
    salt: '0a41679b5e75c3b6532b030551039b1e',
  },
];

const hashPassword = (password: string, salt: string): string => {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
};

export const createUser = async (login: string, password: string): Promise<User> => {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt);
  const user: User = {
    id: randomUUID(),
    login,
    hashedPassword,
    salt,
  };
  users.push(user);
  return user;
};

export const validateUser = async (login: string, password: string): Promise<boolean> => {
  console.log(users);
  const user = getUserByLogin(login);
  if (!user) {
    return false;
  }
  const hashedPassword = hashPassword(password, user.salt);
  return timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(user.hashedPassword));
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const getUserByLogin = (login: string): User | undefined => {
  return users.find((user) => user.login === login);
};
