import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clean existing data
    await prisma.donation.deleteMany();
    await prisma.actionCard.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Create demo creators
    const creator1 = await prisma.user.create({
        data: {
            name: "Nguyễn Văn A",
            username: "nguyenvana",
            email: "nguyenvana@demo.com",
            password: "123456",
            bio: "Lập trình viên & Content Creator",
            isCreator: true,
            creatorTitle: "Tech YouTuber",
            creatorBio: "Chia sẻ kiến thức lập trình và công nghệ mới nhất. Mỗi video là một bài học giúp bạn tiến gần hơn đến ước mơ!",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana",
            socialLinks: JSON.stringify({
                youtube: "https://youtube.com/@nguyenvana",
                twitter: "https://twitter.com/nguyenvana",
                website: "https://nguyenvana.dev",
            }),
        },
    });

    const creator2 = await prisma.user.create({
        data: {
            name: "Trần Thị B",
            username: "tranthib",
            email: "tranthib@demo.com",
            password: "123456",
            bio: "Blogger & Podcaster",
            isCreator: true,
            creatorTitle: "Podcast Host",
            creatorBio: "Podcast về cuộc sống, sự nghiệp và phát triển bản thân. Mỗi tập là một câu chuyện truyền cảm hứng!",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=tranthib",
            socialLinks: JSON.stringify({
                instagram: "https://instagram.com/tranthib",
                facebook: "https://facebook.com/tranthib",
            }),
        },
    });

    const creator3 = await prisma.user.create({
        data: {
            name: "Lê Văn C",
            username: "levanc",
            email: "levanc@demo.com",
            password: "123456",
            bio: "Game Developer & Streamer",
            isCreator: true,
            creatorTitle: "Indie Game Dev",
            creatorBio: "Phát triển game indie và stream gameplay. Đang làm việc trên một dự án RPG thú vị!",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=levanc",
            socialLinks: JSON.stringify({
                youtube: "https://youtube.com/@levanc",
                twitter: "https://twitter.com/levanc",
            }),
        },
    });

    // Create demo supporter
    const supporter = await prisma.user.create({
        data: {
            name: "Người Ủng Hộ",
            username: "supporter",
            email: "supporter@demo.com",
            password: "123456",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=supporter",
        },
    });

    // Create Action Cards for creator1
    const actionCards1 = await Promise.all([
        prisma.actionCard.create({
            data: {
                title: "Mua Cà Phê",
                description: "Giúp mình tỉnh táo để làm video chất lượng hơn!",
                price: 25000,
                emoji: "☕",
                color: "#8B4513",
                creatorId: creator1.id,
                sortOrder: 0,
            },
        }),
        prisma.actionCard.create({
            data: {
                title: "Sponsor Video",
                description: "Đăng ký sponsor cho một video YouTube của mình",
                price: 500000,
                emoji: "🎬",
                color: "#FF0000",
                creatorId: creator1.id,
                sortOrder: 1,
            },
        }),
        prisma.actionCard.create({
            data: {
                title: "Mua Thiết Bị",
                description: "Góp vào quỹ nâng cấp thiết bị quay video",
                price: 100000,
                emoji: "🎥",
                color: "#4A90D9",
                creatorId: creator1.id,
                sortOrder: 2,
            },
        }),
        prisma.actionCard.create({
            data: {
                title: "Super Thanks",
                description: "Cảm ơn đặc biệt - Tên bạn sẽ xuất hiện trong video!",
                price: 200000,
                emoji: "⭐",
                color: "#FFD700",
                creatorId: creator1.id,
                sortOrder: 3,
            },
        }),
    ]);

    // Create Action Cards for creator2
    const actionCards2 = await Promise.all([
        prisma.actionCard.create({
            data: {
                title: "Trà Sữa",
                description: "Một ly trà sữa để mình có năng lượng làm podcast!",
                price: 35000,
                emoji: "🧋",
                color: "#DEB887",
                creatorId: creator2.id,
                sortOrder: 0,
            },
        }),
        prisma.actionCard.create({
            data: {
                title: "Thuê Studio",
                description: "Góp vào tiền thuê studio thu âm chuyên nghiệp",
                price: 150000,
                emoji: "🎙️",
                color: "#9B59B6",
                creatorId: creator2.id,
                sortOrder: 1,
            },
        }),
        prisma.actionCard.create({
            data: {
                title: "Ủng Hộ Tháng",
                description: "Ủng hộ cố định hàng tháng để podcast phát triển",
                price: 99000,
                emoji: "💜",
                color: "#E91E63",
                creatorId: creator2.id,
                sortOrder: 2,
            },
        }),
    ]);

    // Create Action Cards for creator3
    const actionCards3 = await Promise.all([
        prisma.actionCard.create({
            data: {
                title: "Energy Drink",
                description: "Mua nước tăng lực cho những đêm code game",
                price: 20000,
                emoji: "⚡",
                color: "#00FF00",
                creatorId: creator3.id,
                sortOrder: 0,
            },
        }),
        prisma.actionCard.create({
            data: {
                title: "Asset Pack",
                description: "Mua asset để làm game đẹp hơn",
                price: 250000,
                emoji: "🎮",
                color: "#7C3AED",
                creatorId: creator3.id,
                sortOrder: 1,
            },
        }),
        prisma.actionCard.create({
            data: {
                title: "Cloud Server",
                description: "Góp tiền server để game online không lag",
                price: 300000,
                emoji: "☁️",
                color: "#3B82F6",
                creatorId: creator3.id,
                sortOrder: 2,
            },
        }),
    ]);

    // Create demo donations
    const donations = await Promise.all([
        prisma.donation.create({
            data: {
                amount: 25000,
                quantity: 1,
                message: "Video rất hay, cảm ơn bạn!",
                status: "completed",
                actionCardId: actionCards1[0].id,
                creatorId: creator1.id,
                supporterId: supporter.id,
                paymentIntentId: "mock_pi_1",
            },
        }),
        prisma.donation.create({
            data: {
                amount: 75000,
                quantity: 3,
                message: "Chúc kênh ngày càng phát triển! 🎉",
                status: "completed",
                actionCardId: actionCards1[0].id,
                creatorId: creator1.id,
                supporterId: supporter.id,
                paymentIntentId: "mock_pi_2",
            },
        }),
        prisma.donation.create({
            data: {
                amount: 500000,
                quantity: 1,
                message: "Sponsor cho video tiếp theo nhé!",
                status: "completed",
                actionCardId: actionCards1[1].id,
                creatorId: creator1.id,
                supporterId: null,
                isAnonymous: true,
                paymentIntentId: "mock_pi_3",
            },
        }),
        prisma.donation.create({
            data: {
                amount: 35000,
                quantity: 1,
                message: "Podcast rất hay, nghe mỗi ngày!",
                status: "completed",
                actionCardId: actionCards2[0].id,
                creatorId: creator2.id,
                supporterId: supporter.id,
                paymentIntentId: "mock_pi_4",
            },
        }),
        prisma.donation.create({
            data: {
                amount: 99000,
                quantity: 1,
                message: "Ủng hộ podcast hàng tháng! 💜",
                status: "completed",
                actionCardId: actionCards2[2].id,
                creatorId: creator2.id,
                supporterId: supporter.id,
                paymentIntentId: "mock_pi_5",
            },
        }),
        prisma.donation.create({
            data: {
                amount: 60000,
                quantity: 3,
                message: "Chờ game mới ra!",
                status: "completed",
                actionCardId: actionCards3[0].id,
                creatorId: creator3.id,
                supporterId: supporter.id,
                paymentIntentId: "mock_pi_6",
            },
        }),
    ]);

    console.log("✅ Seed complete!");
    console.log(`   - Created ${3} creators`);
    console.log(`   - Created ${1} supporter`);
    console.log(`   - Created ${actionCards1.length + actionCards2.length + actionCards3.length} action cards`);
    console.log(`   - Created ${donations.length} donations`);
    console.log("");
    console.log("📝 Demo accounts:");
    console.log("   Creator 1: nguyenvana@demo.com / 123456");
    console.log("   Creator 2: tranthib@demo.com / 123456");
    console.log("   Creator 3: levanc@demo.com / 123456");
    console.log("   Supporter: supporter@demo.com / 123456");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
