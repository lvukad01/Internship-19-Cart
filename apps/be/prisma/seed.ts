import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.favorite.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

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

  const productsRaw = [
    { 
      name: 'WEEKDAY Barrel Jeans Abell', images:['https://cdn.aboutstatic.com/file/images/0d1336199a2a35518d577228f889ceff.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 75, category: 'Streetwear', pool: clothesPool 
    },
    { 
      name: 'WEEKDAY Between-Season Jacket Eiko', images:['https://cdn.aboutstatic.com/file/images/dc41d29d58a8c242761415032206aeb5.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 35, category: 'Streetwear', pool: clothesPool 
    },
    { 
      name: 'EDITED Between-Season Jacket Jilian', images:['https://cdn.aboutstatic.com/file/images/e26c37dd0895df57e4260181a0eea6dc.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 120, category: 'Streetwear', pool: clothesPool 
    },
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

    {
      name: 'ONLY PLAY Athletic Sweatshirt in Fir', images: ['https://cdn.aboutstatic.com/file/images/1779094f710f9b1bcc83f9b246442aff.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 38, category: 'Sportswear', pool: clothesPool 
    },
    { 
      name: 'ONLY PLAY Tapered Workout Pants', images:['https://cdn.aboutstatic.com/file/images/bc15ad9f534abe43cd9f340cf2fc03be.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 35, category: 'Streetwear', pool: clothesPool 
    },
    { 
      name: 'ONLY PLAY Athletic Zip-Up Hoodie in Black', images:['https://cdn.aboutstatic.com/file/images/224f8d0dcd4998df1e896c024eab0c6e.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 120, category: 'Streetwear', pool: clothesPool 
    },
    { 
      name: 'On Running Shoes Cloudmonster', images:['https://cdn.aboutstatic.com/file/images/8f856878a686e5a617e9f464e302e7bc.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 60, category: 'Streetwear', pool: shoesPool 
    },
    { 
      name: 'CMP Athletic Zip-Up Hoodie in Black', images:['https://cdn.aboutstatic.com/file/images/1d01e455641832d6a393f0755ec3d458.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 68, category: 'Streetwear', pool: clothesPool 
    },
  ];

  for (const p of productsRaw) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        stock: 10,
        images: [p.images ? p.images[0] : placeholderImg],
        colors: ['Black', 'Grey'],
        sizes: p.pool,
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