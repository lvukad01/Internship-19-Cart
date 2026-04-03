import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  // 1. Čišćenje baze
  await prisma.favorite.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Admin user
  await prisma.user.upsert({
    where: { email: 'lana@admin.com' },
    update: {},
    create: {
      email: 'lana@admin.com',
      name: 'Lana Vukadin',
      password: password,
      role: Role.ADMIN,
      address: 'Marmontova 1, Split',
      phone: '091123456',
    },
  });

  const clothesPool = ['S', 'M', 'L', 'XL'];
  const shoesPool = ['44', '45', '46', '47'];
  const placeholderImg = 'https://cdn.aboutstatic.com/file/images/620f50467d57a48b88fdcdb16ffb511b.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800';

  const getRandomSizes = (pool: string[]) => {
    return pool.filter(() => Math.random() > 0.4).concat(pool[0]).slice(0, 3);
  };

  // 3. Proizvodi sada sadrže IME kategorije umjesto ID-a
  const productsRaw = [
    { name: 'Baggy Cargo Pants', price: 75, category: 'Streetwear', pool: clothesPool },
    { name: 'Oversized Graphic Shirt', price: 35, category: 'Streetwear', pool: clothesPool },
    { name: 'Urban Techwear Jacket', price: 120, category: 'Streetwear', pool: clothesPool },
    { name: 'Heavy Cotton Hoodie', price: 60, category: 'Streetwear', pool: clothesPool },
    { name: 'Street Skate Shorts', price: 45, category: 'Streetwear', pool: clothesPool },

    { name: 'Slim Fit Blazer Jacket', price: 150, category: 'Formal Wear', pool: clothesPool },
    { name: 'Classic White Dress Shirt', price: 50, category: 'Formal Wear', pool: clothesPool },
    { name: 'Tailored Formal Pants', price: 90, category: 'Formal Wear', pool: clothesPool },
    { name: 'Premium Silk Tie Shirt', price: 45, category: 'Formal Wear', pool: clothesPool },
    { name: 'Wool Blend Coat', price: 200, category: 'Formal Wear', pool: clothesPool },

    { name: 'Retro High Top Shoes', price: 180, category: 'Footwear', pool: shoesPool },
    { name: 'Low Profile Daily Shoes', price: 95, category: 'Footwear', pool: shoesPool },
    { name: 'Leather Formal Shoes', price: 130, category: 'Footwear', pool: shoesPool },
    { name: 'Running Tech Shoes', price: 110, category: 'Footwear', pool: shoesPool },
    { name: 'Suede Chelsea Boots Shoes', price: 160, category: 'Footwear', pool: shoesPool },
  ];

  // 4. Unos proizvoda s automatskim kreiranjem kategorija
  for (const p of productsRaw) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        stock: 10,
        images: [placeholderImg],
        colors: ['Black', 'Grey'],
        sizes: getRandomSizes(p.pool),
        // Ovdje se događa magija:
        category: {
          connectOrCreate: {
            where: { name: p.category },
            create: { name: p.category },
          },
        },
      },
    });
  }

  console.log('✅ Seed successful: Products and Categories synced!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });