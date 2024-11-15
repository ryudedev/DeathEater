import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'ecc@comp.ac.jp';
  const password = 'password124';

  // パスワードをハッシュ化して保存
  const hashedPassword = await bcrypt.hash(password, 14);

  // 1つ目のOrganizationを作成
  const organization = await prisma.organization.create({
    data: {
      name: 'Reminico',
      address: '東京都千代田区千代田１−１',
      registration_number: 'black0000',
    },
  });

  // Schoolの作成
  const school = await prisma.school.create({
    data: {
      name: 'Reminico-No.1',
      school_registration_number: 'KRY-124',
      address: '東京都墨田区押上１丁目１−２',
      organization_id: organization.id,
      classes: {
        create: [
          { name: 'リンカーン' },
          { name: '秋篠宮' },
        ],
      },
    },
    include: {
      classes: true, // クラス情報を取得
    },
  });

  // Userの作成
  const user = await prisma.user.create({
    data: {
      email,
      lastName: '大谷',
      firstName: '翔平',
      password: hashedPassword, // ハッシュ化したパスワードを直接保存
      role: 'member',
    },
  });

  console.log('Organization, School, and User created:', organization, school, user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });