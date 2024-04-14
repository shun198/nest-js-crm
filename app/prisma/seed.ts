import { PrismaClient } from '@prisma/client';
import { Role } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'test_user_01@example.com' },
    update: {},
    create: {
      name: 'テストユーザゼロイチ',
      employee_number: '00000001',
      email: 'test_user_01@example.com',
      role: Role.ADMIN,
      password: '$2b$12$tg885CjGIz1qs1nN2KFmlu6XdEPc.ucVzx4dwe9thxqL/rpaqWY9C',
      is_active: true,
    },
  });
  await prisma.user.upsert({
    where: { email: 'test_user_02@example.com' },
    update: {},
    create: {
      name: 'テストユーザゼロニ',
      employee_number: '00000002',
      email: 'test_user_02@example.com',
      role: Role.GENERAL,
      password: '$2b$12$tg885CjGIz1qs1nN2KFmlu6XdEPc.ucVzx4dwe9thxqL/rpaqWY9C',
      is_active: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
