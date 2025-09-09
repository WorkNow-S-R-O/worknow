import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	// eslint-disable-next-line no-undef
	host: process.env.SMTP_HOST || 'smtp.gmail.com',
	// eslint-disable-next-line no-undef
	port: process.env.SMTP_PORT || 587,
	secure: false, // Use STARTTLS
	auth: {
		// eslint-disable-next-line no-undef
		user: process.env.SMTP_USER || process.env.EMAIL_USER,
		// eslint-disable-next-line no-undef
		pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

export async function sendEmail(to, subject, html) {
	return transporter.sendMail({
		// eslint-disable-next-line no-undef
		from:
			process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER,
		to,
		subject,
		html,
	});
}
