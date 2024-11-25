import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  try {
    // 1つ目のOrganizationを作成
    const organization = await prisma.organization.upsert({
      where: { registration_number: 'black0000' },
      update: {},
      create: {
        name: 'Reminico',
        address: '東京都千代田区千代田１−１',
        registration_number: 'black0000',
      },
    });

    // 2つ目のOrganizationを作成
    const organization2 = await prisma.organization.upsert({
      where: { registration_number: 'black1111' },
      update: {},
      create: {
        name: 'tokyo',
        address: '東京都港区芝公園4丁目2-8',
        registration_number: 'black1111',
      },
    });

    // Schoolの作成
    const school = await prisma.school.upsert({
      where: { school_registration_number: 'KRY-124' },
      update: {},
      create: {
        name: 'Reminico-No.1',
        school_registration_number: 'KRY-124',
        address: '東京都墨田区押上１丁目１−２',
        organization_id: organization.id,
        classes: {
          create: [{ name: '3年B組' }, { name: 'IE4A' }],
        },
      },
      include: {
        classes: true,
      },
    });

    const school2 = await prisma.school.upsert({
      where: { school_registration_number: 'KRY-718' }, // 正しいキーを指定
      update: {},
      create: {
        name: 'Reminico-No.2',
        school_registration_number: 'KRY-718',
        address: '東京都墨田区押上１丁目１−２',
        organization_id: organization2.id,
        classes: {
          create: [{ name: '3年B組' }, { name: 'IE4A' }],
        },
      },
      include: {
        classes: true,
      },
    });
    // Userの作成
    const usersData = [
      {
        email: 'ecc@comp.ac.jp',
        lastName: '大谷',
        firstName: '翔平',
        role: Role.ROOT,
      },
      {
        email: 'test@comp.ac.jp',
        lastName: '佐藤',
        firstName: '健',
        password: 'password124',
        role: Role.ADMIN,
      },
    ];

    for (const userData of usersData) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          lastName: userData.lastName,
          firstName: userData.firstName,
          role: userData.role,
        },
      });
    }

    // Capsuleの作成
    const capsulesData = [
      {
        class_id: school.classes[0]?.id, // クラスID
        size: 'small',
        release_date: new Date('2030-01-01T00:00:00.000Z'),
        upload_deadline: new Date('2029-12-31T00:00:00.000Z'),
      },
      {
        class_id: school2.classes[1]?.id, // クラスID
        size: 'medium',
        release_date: new Date('2031-03-01T00:00:00.000Z'),
        upload_deadline: new Date('2031-02-28T00:00:00.000Z'),
      },
    ];

    for (const capsuleData of capsulesData) {
      if (!capsuleData.class_id) {
        console.error('Class ID not found for capsule:', capsuleData.title);
        continue;
      }
      await prisma.capsule.create({
        data: capsuleData,
      });
    }

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
