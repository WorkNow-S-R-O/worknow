export const mockEmail = 'tester@example.com';
export const mockVerificationCode = '654321';

export const verificationRecord = {
	email: mockEmail,
	code: mockVerificationCode,
	expiresAt: new Date(Date.now() + 5 * 60 * 1000),
	attempts: 0,
};

export const expiredVerificationRecord = {
	...verificationRecord,
	expiresAt: new Date(Date.now() - 60 * 1000),
};

export const attemptLimitVerificationRecord = {
	...verificationRecord,
	attempts: 3,
};

export const mismatchedVerificationRecord = {
	...verificationRecord,
	code: '999999',
};
