const errorHandler = (err, req, res, next) => {
	console.error('❌ Error on Server side:', err);
	res.status(500).json({ error: 'Error on server side' });
};

export default errorHandler;
