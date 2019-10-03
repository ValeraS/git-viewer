import express from 'express';
import { port } from 'server/config';
import loaders from 'server/loaders';
import { error, info } from 'server/loaders/logger';

export default async pathToRepos => {
  const app = express();

  await loaders({ app, pathToRepos });

  app.listen(port, err => {
    if (err) {
      error(err);
      process.exit(1);
      return;
    }
    info(`Server listening on port ${port}`);
  });
};
