import { Buffer } from 'buffer';

const headerSegment = Buffer.from(
	JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
).toString('base64');

export const buildJwt = (payload) => {
	const payloadSegment = Buffer.from(JSON.stringify(payload)).toString('base64');
	return `${headerSegment}.${payloadSegment}.signature`;
};

export const validJwtPayload = {
	sub: 'user_123',
	email: 'test@example.com',
	first_name: 'Test',
	last_name: 'User',
	image_url: 'https://example.com/avatar.png',
};

export const jwtPayloadWithoutSub = {
	email: 'test@example.com',
	first_name: 'Test',
	last_name: 'User',
	image_url: 'https://example.com/avatar.png',
};

export const validJwt = buildJwt(validJwtPayload);
export const jwtWithoutSub = buildJwt(jwtPayloadWithoutSub);

export const malformedJwt = 'invalid.token';
export const invalidBase64Jwt = `${headerSegment}.@@@.signature`;

export const buildAuthHeader = (token) => ({
	authorization: `Bearer ${token}`,
});

export const missingAuthHeader = {};

export const adminUserId = 'admin-user';
export const regularUserId = 'regular-user';

export const adminUserRecord = { isAdmin: true };
export const regularUserRecord = { isAdmin: false };
