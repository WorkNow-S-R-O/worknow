import paymentRoutes from './payments.js';
import jobsRoutes from './jobs.js';
import citiesRoutes from './cities.js';
import usersRoutes from './users.js';
import webhookRoutes from './webhook.js';
import seekersRoutes from './seekers.js';
import categoriesRoutes from './categories.js';
import messagesRoutes from './messages.js';
import uploadRoutes from './upload.js';
import s3UploadRoutes from './s3Upload.js';
import newsletterRoutes from './newsletter.js';

const registerRoutes = (app) => {
	app.use('/api/payments', paymentRoutes);
	app.use('/api/cities', citiesRoutes);
	app.use('/api/jobs', jobsRoutes);
	app.use('/api/users', usersRoutes);
	app.use('/webhook', webhookRoutes);
	app.use('/api/seekers', seekersRoutes);
	app.use('/api/categories', categoriesRoutes);
	app.use('/api/messages', messagesRoutes);
	app.use('/api/upload', uploadRoutes);
	app.use('/api/s3-upload', s3UploadRoutes);
	app.use('/api/newsletter', newsletterRoutes);
};

export default registerRoutes;
