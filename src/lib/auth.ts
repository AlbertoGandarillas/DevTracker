import { prisma } from './prisma';

export async function getUserByEmail(email: string) {
  return await prisma.devTracker_User.findUnique({
    where: { email: email.toLowerCase() }
  });
}

export async function isUserAuthorized(email: string): Promise<boolean> {
  const user = await getUserByEmail(email);
  return user !== null;
}

export async function updateUserInfo(email: string, name?: string) {
  const existingUser = await getUserByEmail(email);
  
  if (!existingUser) {
    throw new Error('User not found in database');
  }

  return await prisma.devTracker_User.update({
    where: { email: email.toLowerCase() },
    data: {
      name: name || existingUser.name,
    },
  });
} 