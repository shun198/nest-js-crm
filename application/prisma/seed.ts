import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      nickName: 'Alice',
      hashedPassword: '$2b$12$tg885CjGIz1qs1nN2KFmlu6XdEPc.ucVzx4dwe9thxqL/rpaqWY9C',
      tasks: {
        create: {
          title: '懸垂',
          description: '広背筋と大円筋を鍛える種目',
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
