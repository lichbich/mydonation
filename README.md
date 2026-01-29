# 🎁 MyDonation - Action Cards Donation Platform

Một nền tảng donation dựa trên Action Cards, lấy cảm hứng từ BuyMeACoffee nhưng với UX khác biệt.

## ✨ Tính năng

- **Action Cards**: Thay vì "Buy Coffee" chung chung, creators tạo các cards với mục tiêu cụ thể
- **Creator Profiles**: Trang cá nhân đẹp mắt với SEO tối ưu
- **Payment Simulation**: Mock checkout để test flow
- **Dashboard**: Quản lý Action Cards và xem thống kê
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Forms**: react-hook-form + zod
- **Database**: Prisma + SQLite (dev) / PostgreSQL (production)
- **Auth**: NextAuth v5 (Credentials)
- **Payment**: Mock simulation (ready for Stripe)

## 🚀 Bắt đầu

### Prerequisites

- Node.js 18+
- npm hoặc pnpm

### Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd mydonation

# Cài dependencies
npm install

# Tạo database và seed data
npm run db:push
npm run db:seed

# Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem app.

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run db:push    # Push schema to database
npm run db:seed    # Seed demo data
npm run db:reset   # Reset database và seed lại
```

## 📝 Tài khoản Demo

Sau khi chạy `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Creator 1 | nguyenvana@demo.com | 123456 |
| Creator 2 | tranthib@demo.com | 123456 |
| Creator 3 | levanc@demo.com | 123456 |
| Supporter | supporter@demo.com | 123456 |

## 📁 Cấu trúc thư mục

```
mydonation/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── checkout/          # Checkout pages
│   ├── dashboard/         # Creator dashboard
│   ├── explore/           # Browse creators
│   ├── login/             # Auth pages
│   ├── register/
│   └── [username]/        # Dynamic creator profiles
├── components/             # React components
│   ├── cards/             # Card components
│   ├── checkout/          # Checkout components
│   ├── layout/            # Layout components
│   └── ui/                # shadcn/ui components
├── lib/                    # Utilities
│   ├── actions/           # Server actions
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas
└── prisma/                 # Database
    ├── schema.prisma      # Prisma schema
    └── seed.ts            # Seed data
```

## 🎨 Tính năng UI

- **Dark Theme**: Giao diện tối mặc định với gradient đẹp mắt
- **Glass Morphism**: Hiệu ứng kính mờ hiện đại
- **Animations**: Micro-interactions mượt mà
- **Skeleton Loading**: Loading states cho UX tốt hơn
- **Empty States**: Hiển thị khi không có dữ liệu
- **Toast Notifications**: Thông báo với Sonner

## 🔐 Authentication Flow

1. User đăng ký với email/password
2. Đăng nhập để truy cập Dashboard
3. Tạo Action Cards để nhận donations
4. Chia sẻ link profile cho supporters

## 💳 Payment Simulation

Flow thanh toán mock:
1. Supporter chọn Action Card
2. Điền số lượng và message
3. Redirect đến trang payment simulation
4. Chọn "Thanh Toán" (success) hoặc "Hủy" (cancel)
5. Cập nhật status donation trong DB

## 🗄 Database Schema

### User
- Profile info (name, username, email, bio)
- Creator settings (title, bio, cover, social links)
- Relations: ActionCards, Donations

### ActionCard
- Title, description, price
- Emoji, color
- Active status
- Creator relation

### Donation
- Amount, quantity, message
- Anonymous flag
- Status (pending, completed, cancelled)
- Relations: ActionCard, Supporter, Creator

## 🚀 Deploy lên Production

### Chuyển sang PostgreSQL

1. Cập nhật `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set `DATABASE_URL` trong environment

3. Chạy `npx prisma migrate deploy`

### Environment Variables

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-production-secret"
AUTH_URL="https://your-domain.com"
```

## 📄 License

MIT

---

Made with ❤️ by MyDonation Team
