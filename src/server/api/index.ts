import { Router } from 'express';
import gitApi from 'server/api/routes/git-api';

export default () => {
  const app = Router();

  gitApi(app);

  return app;
};
