import healthRouter from './healthRoutes.js';
import userRouter from './userRoutes.js';

const registerRoutes = (app) => {
  app.use('/healthz', healthRouter);
  app.use('/cicd', healthRouter);
  app.use('/v1/user', userRouter);
};

export default registerRoutes;