import env from 'dotenv';

env.config();

export const port = parseInt(process.env.PORT || '3000', 10);

export const api = {
  prefix: process.env.API_PREFIX || '/api',
};

export const logging = {
  verbose: process.env.VERBOSE === '1',
};
