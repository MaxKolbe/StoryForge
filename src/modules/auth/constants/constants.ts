import { env } from '../../../config/env.validation.js';

export const jwtConstants = {
  secret: env.JWT_SECRET,
};
