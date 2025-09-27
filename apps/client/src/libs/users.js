import prisma from './prisma';

export async function createUser(data) {
	try {
		const user = await prisma.user.create({ data });
		return { user };
	} catch (error) {
		return { error };
	}
}

export async function getUserById({ id, clerkUserId }) {
	try {
		if (!id && !clerkUserId) {
			throw new Error('id or clerkUserId is required');
		}

		const query = id ? { id } : { clerkUserId };

		const user = await prisma.user.findUnique({ where: query });
		return { user };
	} catch (error) {
		return { error };
	}
}

export async function UpdateUser(id, data) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data,
		});
		return { user };
	} catch (error) {
		return { error };
	}
}
