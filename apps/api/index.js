import app from './app.js';
import { PORT } from './config/env.js';
import registerRoutes from './routes/routes.js';
import registerHealthRoutes from './routes/health.js';
import errorHandler from './middlewares/errorHandler.js';

// Register routes
registerRoutes(app);
registerHealthRoutes(app);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
