import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.ts';



function getEnv(name, fallback) {
  const v = process.env[name];
  if (v && String(v).trim().length > 0) return v;
  return fallback;
}

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

const superAdminUsername = getEnv('SEED_SUPER_ADMIN_USERNAME', 'superadmin');
const superAdminPassword = getEnv('SEED_SUPER_ADMIN_PASSWORD', 'SuperAdmin#123');

const inventoryAdminUsername = getEnv('SEED_INVENTORY_ADMIN_USERNAME', 'inventoryadmin');
const inventoryAdminPassword = getEnv('SEED_INVENTORY_ADMIN_PASSWORD', 'InventoryAdmin#123');

async function main() {
  console.log('Seeding admin users...');

  const superHash = await bcrypt.hash(superAdminPassword, saltRounds);
  const inventoryHash = await bcrypt.hash(inventoryAdminPassword, saltRounds);

  // Upsert Super Admin
  await prisma.user.upsert({
    where: { username: superAdminUsername },
    update: {
      passwordHash: superHash,
      role: 'SUPER_ADMIN',
    },
    create: {
      username: superAdminUsername,
      passwordHash: superHash,
      role: 'SUPER_ADMIN',
    },
  });

  // Upsert Inventory Admin
  await prisma.user.upsert({
    where: { username: inventoryAdminUsername },
    update: {
      passwordHash: inventoryHash,
      role: 'INVENTORY_CONTENT_ADMIN',
    },
    create: {
      username: inventoryAdminUsername,
      passwordHash: inventoryHash,
      role: 'INVENTORY_CONTENT_ADMIN',
    },
  });

  console.log('Seeding successful.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });