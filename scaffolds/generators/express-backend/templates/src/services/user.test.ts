import type { Context } from '@/lib/shared/types';
import { mockedLogger } from '@/lib/test/utils';
import type { ContextKind } from '@/types';
import type { JwtPayload } from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getUser } from './user';

describe('User Service', () => {
  const mockContext = {
    env: 'development',
    logger: mockedLogger,
  } as Context<ContextKind>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should throw an error if the JWT payload is missing "sub"', async () => {
      const payload: JwtPayload = {};

      await expect(getUser(mockContext, payload)).rejects.toThrow(
        'Malformed JWT payload, unable to authenticate user.',
      );

      expect(mockedLogger.error).toHaveBeenCalledWith(
        'JWT provided to user service is missing "sub" property intended to be the user.id',
      );
    });

    it('should return a user object if the payload contains "sub"', async () => {
      const payload: JwtPayload = { sub: '12345' };

      const result = await getUser(mockContext, payload);

      expect(result).toEqual({ user: { id: '12345' } });
    });

    it('should throw an error in production environment. *Remove this once a production integration has been established*', async () => {
      const productionContext: Context<ContextKind> = {
        ...mockContext,
        env: 'production',
      };
      const payload: JwtPayload = { sub: '12345' };

      await expect(getUser(productionContext, payload)).rejects.toThrow(
        'User authentication not implemented',
      );
    });
  });
});
