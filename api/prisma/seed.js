import { PrismaClient, Role } from '@prisma/client';
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
        classes: true, // クラスも含めて取得
      },
    });

    // 既存のクラスを取得し、別の学校に関連付け
    const existingClasses = school.classes.map((cls) => ({ id: cls.id }));

    const school2 = await prisma.school.upsert({
      where: { school_registration_number: 'KRY-718' },
      update: {},
      create: {
        name: 'Reminico-No.2',
        school_registration_number: 'KRY-718',
        address: '東京都墨田区押上１丁目１−２',
        organization_id: organization2.id,
        classes: {
          connect: existingClasses, // 既存のクラスを関連付け
        },
      },
      include: {
        classes: true, // 確認のためクラスを含めて取得
      },
    });

    // Userの作成
    const usersData = [
      {
        cognito_id: 'b97ab5bc-b041-704b-c057-1da55dc250de',
        email: '2210086@ecc.ac.jp',
        lastName: '御手洗',
        firstName: '匠',
        role: Role.MEMBER,
        class_name: 'IE4A', // class_idではなく、class_nameで受け取る
      },
      {
        cognito_id: 'b97ab5bc-b041-704b-c057-1da55dc3md9d',
        email: '2210436@ecc.ac.jp',
        lastName: '近藤',
        firstName: '匠',
        role: Role.LEADER,
        class_name: 'IE4A', // class_idではなく、class_nameで受け取る
      },
      {
        cognito_id: '397a25dc-a041-705e-f747-e0e0b04e3fe8',
        email: '2210441@ecc.ac.jp',
        lastName: '高本',
        firstName: '龍信',
        role: Role.ADMIN,
        class_name: 'IE4A', // class_idではなく、class_nameで受け取る
      },
    ];

    const userIds = {}; // email -> userId マッピング

    for (const userData of usersData) {
      // Userの作成または取得
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          cognito_id: userData.cognito_id,
          email: userData.email,
          lastName: userData.lastName,
          firstName: userData.firstName,
          role: userData.role,
        },
      });

      userIds[userData.email] = user.id; // User IDを保持

      // class_nameからclass_idを取得
      const userClass = await prisma.class.findFirst({
        where: { name: userData.class_name }, // class_nameでクラスを検索
      });

      if (!userClass) {
        console.error(`Class with name ${userData.class_name} not found.`);
        continue;
      }

      // UserClassesの関連付けを作成
      await prisma.userClasses.create({
        data: {
          user_id: user.id, // 取得したユーザのID
          class_id: userClass.id, // 関連付けるクラスID
        },
      });
    }

    // Capsuleの作成
    const capsulesData = [
      {
        name: "IE4A's Capsule",
        class_id: school.classes[1]?.id, // クラスID
        size: 'small',
        release_date: new Date('2030-01-01T00:00:00.000Z'),
        upload_deadline: new Date('2029-12-31T00:00:00.000Z'),
      },
      {
        name: "3年B組's Capsule",
        class_id: school2.classes[0]?.id, // クラスID
        size: 'medium',
        release_date: new Date('2031-03-01T00:00:00.000Z'),
        upload_deadline: new Date('2031-02-28T00:00:00.000Z'),
      },
    ];

    let smallCapsuleId;

    for (const capsuleData of capsulesData) {
      if (!capsuleData.class_id) {
        console.error('Class ID not found for capsule.');
        continue;
      }

      const capsule = await prisma.capsule.create({
        data: capsuleData,
      });

      if (capsuleData.size === 'small') {
        smallCapsuleId = capsule.id; // smallカプセルのIDを保持
      }
    }

    let previousHistoryId;

    const historyData = [
      {
        capsule_id: smallCapsuleId,
        event: 'カプセルに追加しました。',
        user_id: userIds['2210086@ecc.ac.jp'],
      },
      {
        capsule_id: smallCapsuleId,
        event: '管理者に許可されました。',
        user_id: userIds['2210441@ecc.ac.jp'],
      },
      {
        capsule_id: smallCapsuleId,
        event: 'カプセルに追加しました。',
        user_id: userIds['2210436@ecc.ac.jp'],
      },
      {
        capsule_id: smallCapsuleId,
        event: '管理者に許可されました。',
        user_id: userIds['2210441@ecc.ac.jp'],
      },
      {
        capsule_id: smallCapsuleId,
        event: 'カプセルに追加しました。',
        user_id: userIds['2210086@ecc.ac.jp'],
      },
      {
        capsule_id: smallCapsuleId,
        event: '管理者に許可されました。',
        user_id: userIds['2210441@ecc.ac.jp'],
      },
    ];

    for (const history of historyData) {
      // 前回の履歴IDをhistory_idとして設定
      if (history.event.includes('管理者')) {
        history.history_id = previousHistoryId;
      }

      console.log(history);

      const record = await prisma.history.create({
        data: history,
      });

      if (!record.event.includes('管理者')) {
        previousHistoryId = record.id;
      } else {
        previousHistoryId = null;
      }
    }

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
