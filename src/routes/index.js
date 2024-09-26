import healthRouter from './healthRoutes.js';

const registerRoutes = (app) => {
  app.use('/healthz', healthRouter);
};

export default registerRoutes;