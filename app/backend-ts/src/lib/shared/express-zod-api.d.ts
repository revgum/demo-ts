import type { Logger } from 'pino';

// Required to extend the express-zod-api module to include Pino logger method overrides
declare module 'express-zod-api' {
  interface LoggerOverrides extends Logger {}
}
