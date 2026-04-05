import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.favorite.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({}); 
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.create({
      data: {
        email: 'lana@admin.com',
        name: 'Lana Vukadin',
        password: password,
        role: Role.ADMIN,
        address: 'Marmontova 1, Split',
        county: 'Splitsko-dalmatinska',
        iban: 'HR1234567890123456789',
        expiryDate: '12/28',
        cvv: '123',
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
    { 
      name: 'EDITED Between-Season Jacket Jen', images:['https://cdn.aboutstatic.com/file/images/fcdf8f6e965e1f7834d17579e9dc4734.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 60, category: 'Streetwear', pool: clothesPool, colors:['Beige'] 
    },
    { name: 'ONLY Between-Season Jacket ONLApril', images:['https://cdn.aboutstatic.com/file/images/575986f514b9a77d40000981a24b9b6e.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 45, category: 'Streetwear', pool: clothesPool },

    { name: 'InWear Blazer Adian', images:['https://cdn.aboutstatic.com/file/images/0c3e8a63433ac24051c5212a6dcd9df0.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 150, category: 'Formal Wear', pool: clothesPool 
    },
    { name: 'InWear Wide leg Pleated Pants Adian', images:['https://cdn.aboutstatic.com/file/images/b940ef0cd11299d7c8868edd7c3fa683.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 50, category: 'Formal Wear', pool: clothesPool 
    },
    { name: 'SEIDENSTICKER Blouse', images:['https://cdn.aboutstatic.com/file/images/5eb65999c9338c37d14a7e613d768be4?brightness=0.96&quality=75&trim=1&height=1067&width=800'], 
      price: 90, category: 'Formal Wear', pool: clothesPool 
    },
    { name: 'Premium Silk Tie Shirt', images:['https://cdn.aboutstatic.com/file/images/9526eaeb19f5ab437586518159756bbd.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 45, category: 'Formal Wear', pool: clothesPool 
    },
    { name: 'Wool Blend Coat', images:['https://cdn.aboutstatic.com/file/images/eb84f8c21d35979a19b094ef40502492.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 200, category: 'Formal Wear', pool: clothesPool 
    },

    { 
      name: 'On Sneakers THE ROGER Advantage', images:['https://cdn.aboutstatic.com/file/images/0c78e83f213d3337b8bf216d90c5ee43.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 180, category: 'Footwear', pool: shoesPool 
    },
    { 
      name: 'Garment Project Sneakers Kit', images:['https://cdn.aboutstatic.com/file/images/23f08e3fb045187c79066fcb911770cd.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 95, category: 'Footwear', pool: shoesPool 
    },
    { 
      name: 'ABOUT YOU Sneakers Dorian', images:['https://cdn.aboutstatic.com/file/images/728f05b9c22a5e5f25f2b13764e5a34b.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 130, category: 'Footwear', pool: shoesPool 
    },
    { 
      name: 'Running Tech Shoes', images:['https://cdn.aboutstatic.com/file/images/8f856878a686e5a617e9f464e302e7bc.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 110, category: 'Footwear', pool: shoesPool 
    },
    { 
      name: 'ABOUT YOU Sneakers Darius', images:['https://cdn.aboutstatic.com/file/images/0f81a4f4e9c24b75b5ea86adbc7a0e4c.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 160, category: 'Footwear', pool: shoesPool 
    },

    {
      name: 'ONLY PLAY Athletic Sweatshirt in Fir', images: ['https://cdn.aboutstatic.com/file/images/1779094f710f9b1bcc83f9b246442aff.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 38, category: 'Sportswear', pool: clothesPool 
    },
    { 
      name: 'ONLY PLAY Tapered Workout Pants', images:['https://cdn.aboutstatic.com/file/images/bc15ad9f534abe43cd9f340cf2fc03be.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'], 
      price: 35, category: 'Sportswear', pool: clothesPool 
    },
    { 
      name: 'ONLY PLAY Athletic Zip-Up Hoodie in Black', images:['https://cdn.aboutstatic.com/file/images/224f8d0dcd4998df1e896c024eab0c6e.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 120, category: 'Sportswear', pool: clothesPool 
    },
    { 
      name: 'On Running Shoes Cloudmonster', images:['https://cdn.aboutstatic.com/file/images/8f856878a686e5a617e9f464e302e7bc.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 60, category: 'Sportswear', pool: shoesPool 
    },
    { 
      name: 'CMP Athletic Zip-Up Hoodie in Black', images:['https://cdn.aboutstatic.com/file/images/1d01e455641832d6a393f0755ec3d458.png?bg=F4F4F5&quality=75&trim=1&height=1067&width=800'],
      price: 68, category: 'Sportswear', pool: clothesPool 
    },
  ];

  for (const p of productsRaw) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        stock: 10,
        images: [p.images ? p.images[0] : placeholderImg],
        colors: p.colors || ['Black', 'Grey'],
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

  console.log('✅ Seed successful');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });