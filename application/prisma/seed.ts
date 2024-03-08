import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'test_user_01@example.com' },
    update: {},
    create: {
      name: 'テストユーザゼロイチ',
      employee_number: '00000001',
      email: 'test_user_01@example.com',
      password: '$2b$12$tg885CjGIz1qs1nN2KFmlu6XdEPc.ucVzx4dwe9thxqL/rpaqWY9C',
      is_active: true,
      groups: {
        create: {
          name: '管理者',
        },
      },
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
