import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Hash the demo password
    const hashedPassword = await bcrypt.hash('123456', 10)

    // 1. Create Creators
    // Creator 1: Gamer/Streamer
    const creator1 = await prisma.user.upsert({
        where: { username: 'duna_gamer' },
        update: {},
        create: {
            name: 'Dũng CT',
            username: 'duna_gamer',
            email: 'dungct@demo.com',
            passwordHash: hashedPassword, // Properly hashed password
            image: 'https://ui-avatars.com/api/?name=Dung+CT&background=0D8ABC&color=fff',
            bio: 'Streamer game kinh dị số 1 Việt Nam (tự phong).',
            role: 'CREATOR',
            creatorProfile: {
                create: {
                    headline: 'Full-time Streamer & Youtuber',
                    accentColor: '#ef4444',
                    socialLinks: JSON.stringify({
                        youtube: 'https://youtube.com',
                        facebook: 'https://facebook.com',
                        discord: 'https://discord.gg'
                    })
                }
            }
        }
    })

    // Creator 2: Digital Artist
    const creator2 = await prisma.user.upsert({
        where: { username: 'minh_art' },
        update: {},
        create: {
            name: 'Minh Họa',
            username: 'minh_art',
            email: 'minhart@demo.com',
            passwordHash: hashedPassword,
            image: 'https://ui-avatars.com/api/?name=Minh+Hoa&background=db2777&color=fff',
            bio: 'Vẽ vời linh tinh, nhận commission.',
            role: 'CREATOR',
            creatorProfile: {
                create: {
                    headline: 'Concept Artist & Illustrator',
                    accentColor: '#db2777',
                    socialLinks: JSON.stringify({
                        instagram: 'https://instagram.com',
                        twitter: 'https://twitter.com'
                    })
                }
            }
        }
    })

    // Fan User
    const fan = await prisma.user.upsert({
        where: { username: 'fan_boy_99' },
        update: {},
        create: {
            name: 'Fan Cứng 99',
            username: 'fan_boy_99',
            email: 'fan@demo.com',
            passwordHash: hashedPassword,
            image: 'https://ui-avatars.com/api/?name=Fan+Boy&background=random',
            role: 'FAN'
        }
    })

    // 2. Action Cards
    // Dũng CT
    await prisma.actionCard.createMany({
        data: [
            { creatorId: creator1.id, title: 'Tặng 1 ly cafe', price: 20000, icon: '☕', description: 'Giúp tôi tỉnh táo stream game' },
            { creatorId: creator1.id, title: 'Tặng Pizza', price: 150000, icon: '🍕', description: 'Đói quá anh em ơi', isFeatured: true },
            { creatorId: creator1.id, title: 'Donate mua game mới', price: 500000, icon: '🎮', description: 'Để mua Resident Evil 9' },
        ]
    })

    // Minh Art
    await prisma.actionCard.createMany({
        data: [
            { creatorId: creator2.id, title: 'Sketch nhanh', price: 50000, icon: '✏️', description: 'Cảm ơn bạn đã ủng hộ nét vẽ' },
            { creatorId: creator2.id, title: 'Mua cọ vẽ mới', price: 100000, icon: '🖌️', isFeatured: true },
            { creatorId: creator2.id, title: 'Nuôi mèo béo', price: 20000, icon: '🐱', description: 'Tiền pate cho Boss' },
        ]
    })

    // 3. Posts
    await prisma.post.create({
        data: {
            creatorId: creator1.id,
            title: 'Lịch stream tuần này',
            content: '# Lịch Stream\n\n- Thứ 2: Game kinh dị\n- Thứ 4: Talkshow\n- Thứ 6: Game mới',
            visibility: 'PUBLIC'
        }
    })

    await prisma.post.createMany({
        data: [
            { creatorId: creator1.id, title: 'Review con game rác đêm qua', content: 'Game gì mà lỗi tùm lum...', visibility: 'MEMBERS' },
            { creatorId: creator2.id, title: 'WIP dự án mới', content: 'Đang vẽ dở, leak cho anh em xem trước.', visibility: 'MEMBERS' }
        ]
    })

    // 4. Gallery Items
    await prisma.galleryItem.createMany({
        data: [
            { creatorId: creator2.id, type: 'IMAGE', url: 'https://picsum.photos/seed/art1/800/600', title: 'Concept Art #1' },
            { creatorId: creator2.id, type: 'IMAGE', url: 'https://picsum.photos/seed/art2/800/600', title: 'Character Design' },
            { creatorId: creator2.id, type: 'IMAGE', url: 'https://picsum.photos/seed/art3/800/600', title: 'Landscape', visibility: 'MEMBERS' },
            { creatorId: creator1.id, type: 'VIDEO', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Highlight Stream hôm qua' },
            { creatorId: creator1.id, type: 'IMAGE', url: 'https://picsum.photos/seed/game1/800/600', title: 'Setup góc máy mới' },
            { creatorId: creator1.id, type: 'IMAGE', url: 'https://picsum.photos/seed/game2/800/600', title: 'Offline cùng fan' },
        ]
    })

    // 5. Membership Tiers
    await prisma.membershipTier.createMany({
        data: [
            { creatorId: creator1.id, title: 'Fan Cứng', priceMonthlyCents: 50000, perks: JSON.stringify(['Huy hiệu fan cứng', 'Xem post thành viên']) },
            { creatorId: creator2.id, title: 'Supporter', priceMonthlyCents: 30000, perks: JSON.stringify(['Truy cập thư viện sketch', 'Quyền ưu tiên request']) },
            { creatorId: creator2.id, title: 'VIP Art Collector', priceMonthlyCents: 200000, perks: JSON.stringify(['Nhận file PSD gốc', 'Video process']) },
        ]
    })

    // 6. Support Transactions
    const dunaActionCards = await prisma.actionCard.findMany({ where: { creatorId: creator1.id } })
    const minhActionCards = await prisma.actionCard.findMany({ where: { creatorId: creator2.id } })

    if (dunaActionCards.length > 0) {
        await prisma.supportTransaction.create({
            data: {
                creatorId: creator1.id,
                fanId: fan.id,
                actionCardId: dunaActionCards[0].id,
                amountCents: dunaActionCards[0].price,
                message: 'Stream vui vẻ nha anh!',
                status: 'SUCCESS'
            }
        })
    }

    if (minhActionCards.length > 0) {
        await prisma.supportTransaction.create({
            data: {
                creatorId: creator2.id,
                fanId: null, // Anonymous
                actionCardId: minhActionCards[1].id,
                amountCents: minhActionCards[1].price * 2, // Donate double
                message: 'Tranh đẹp quá, tặng bạn thêm cái cọ nữa.',
                status: 'SUCCESS'
            }
        })
    }

    // 7. Requests
    await prisma.request.create({
        data: {
            creatorId: creator2.id,
            fanId: fan.id,
            type: 'COMMISSION',
            budgetCents: 500000,
            description: 'Vẽ giúp mình avatar phong cách anime cho kênh Youtube của mình.',
            status: 'NEW'
        }
    })

    await prisma.request.create({
        data: {
            creatorId: creator1.id,
            fanId: fan.id,
            type: 'SHOUTOUT',
            budgetCents: 100000,
            deadline: new Date('2024-12-31'),
            description: 'Chúc mừng sinh nhật bạn gái mình tên là Lan trên stream nhé.',
            status: 'DONE'
        }
    })

    console.log('✅ Seed completed successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
