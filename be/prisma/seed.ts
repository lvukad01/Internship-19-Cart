import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

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

  const kat1 = await prisma.category.create({ data: { name: 'Shoes' } });
  const kat2 = await prisma.category.create({ data: { name: 'Clothing' } });
  const kat3 = await prisma.category.create({ data: { name: 'Accessories' } });

  const products = [
    { name: 'Nike Zoom', price: 120, catId: kat1.id, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
    { name: 'Adidas Ultraboost', price: 180, catId: kat1.id, img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb' },
    { name: 'Cotton T-Shirt Grey', price: 25, catId: kat2.id, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
    { name: 'Black Hoodie', price: 55, catId: kat2.id, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7' },
    { name: 'Leather Wallet', price: 40, catId: kat3.id, img: 'https://images.unsplash.com/photo-1627123424574-724758594e93' },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: 'High-quality products available immediately in Split.',
        price: p.price,
        stock: 5,
        brand: 'DUMP Brand',
        categoryId: p.catId,
        images: [p.img],
        colors: ['Black', 'White'],
        sizes: ['S', 'M', 'L', '42', '43'],
      }
    });
  }

  console.log('✅ Seed successful!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

