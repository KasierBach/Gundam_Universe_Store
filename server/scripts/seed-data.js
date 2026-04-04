const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../src/modules/product/category.model');
const Product = require('../src/modules/product/product.model');
const User = require('../src/modules/user/user.model');
const {
  PRODUCT_GRADES,
  PRODUCT_RARITIES,
  PRODUCT_CONDITIONS,
} = require('../src/shared/constants/productConstants');

const CATEGORIES = [
  { name: 'HG - High Grade', description: '1/144 scale kits with fast build time and strong shelf presence.' },
  { name: 'RG - Real Grade', description: '1/144 scale kits with dense detail, advanced articulation and layered engineering.' },
  { name: 'MG - Master Grade', description: '1/100 scale kits focused on inner frame detail and premium build experience.' },
  { name: 'PG - Perfect Grade', description: 'Flagship large-scale kits built for display collectors and showcase projects.' },
  { name: 'Premium / Limited', description: 'High-end, premium-tier or harder-to-find showcase releases.' },
  { name: 'Tools & Acc', description: 'Tools, waterslides and accessories for builders and collectors.' },
];

// Price references were checked from Gundam Planet product listings on April 4, 2026.
// Prices and availability may change, so these are treated as realistic seed references.
const PRODUCTS = [
  {
    name: 'HG Gundam Aerial Rebuild',
    price: 22.95,
    stock: 18,
    description: 'A fast, approachable Witch from Mercury kit with updated backpack equipment, clean color separation and strong poseability for a high-grade build.',
    grade: PRODUCT_GRADES.HG,
    series: 'Mobile Suit Gundam: The Witch from Mercury',
    rarity: PRODUCT_RARITIES.COMMON,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, PE', dimensions: 'Approx. 12.5 in box length', weight: '0.35kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/hg-gundam-aerial-rebuild-gp.jpg?v=1737714568',
        publicId: 'source/gundamplanet/hg-gundam-aerial-rebuild',
        isMain: true,
      },
    ],
    tags: ['Suletta Mercury', 'GUND Format', 'Witch from Mercury', 'Aerial Rebuild'],
  },
  {
    name: 'HG Gundam Calibarn',
    price: 24.95,
    stock: 14,
    description: 'A sharp late-series Witch from Mercury release with broom-style weapon loadout, shell unit highlights and excellent value for a display-first HG.',
    grade: PRODUCT_GRADES.HG,
    series: 'Mobile Suit Gundam: The Witch from Mercury',
    rarity: PRODUCT_RARITIES.RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, PE', dimensions: 'Approx. 12.5 in box length', weight: '0.38kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/hg-gundam-calibarn-gp.jpg?v=1737719019',
        publicId: 'source/gundamplanet/hg-gundam-calibarn',
        isMain: true,
      },
    ],
    tags: ['Calibarn', 'Suletta Mercury', 'Witch from Mercury', 'Final battle'],
  },
  {
    name: 'RG RX-93 Nu Gundam',
    price: 56.95,
    stock: 9,
    description: 'A highly regarded Real Grade release with refined articulation, layered armor separation and a balanced silhouette that makes it a standout UC display kit.',
    grade: PRODUCT_GRADES.RG,
    series: "Mobile Suit Gundam: Char's Counterattack",
    rarity: PRODUCT_RARITIES.SUPER_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, ABS, PP', dimensions: 'Approx. 15.5 in box length', weight: '0.55kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/rg-rx-93-nu-gundam-gp.jpg?v=1737676666',
        publicId: 'source/gundamplanet/rg-rx-93-nu-gundam',
        isMain: true,
      },
    ],
    tags: ['Amuro Ray', 'Londo Bell', 'Nu Gundam', 'Universal Century'],
  },
  {
    name: 'RG GF13-017NJII God Gundam',
    price: 50.95,
    stock: 7,
    description: 'An articulation-focused Real Grade built around martial-arts posing, effect parts and one of the most dynamic silhouettes in the entire RG line.',
    grade: PRODUCT_GRADES.RG,
    series: 'Mobile Fighter G Gundam',
    rarity: PRODUCT_RARITIES.SUPER_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, ABS, PET', dimensions: 'Approx. 12.5 in box length', weight: '0.47kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/rg-gf13-017njii-god-gundam-gp.jpg?v=1737702404',
        publicId: 'source/gundamplanet/rg-god-gundam',
        isMain: true,
      },
    ],
    tags: ['Domon Kasshu', 'Burning Gundam', 'God Finger', 'G Gundam'],
  },
  {
    name: 'RG MSN-04 Sazabi',
    price: 62.95,
    stock: 6,
    description: 'A large, shelf-dominating Real Grade with heavy armor volume, premium mechanical layering and a strong presence for Char-focused UC collections.',
    grade: PRODUCT_GRADES.RG,
    series: "Mobile Suit Gundam: Char's Counterattack",
    rarity: PRODUCT_RARITIES.ULTRA_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, ABS, PP', dimensions: 'Approx. 15.7 in box length', weight: '0.72kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/rg-msn-04-sazabi-gp.jpg?v=1737672466',
        publicId: 'source/gundamplanet/rg-msn-04-sazabi',
        isMain: true,
      },
    ],
    tags: ['Char Aznable', 'Neo Zeon', 'Sazabi', 'Universal Century'],
  },
  {
    name: 'MG ASW-G-08 Gundam Barbatos',
    price: 60.95,
    stock: 10,
    description: 'A modern Master Grade with exposed frame detail, crisp color separation and a straightforward build that works well for both collectors and custom painters.',
    grade: PRODUCT_GRADES.MG,
    series: 'Mobile Suit Gundam: Iron-Blooded Orphans',
    rarity: PRODUCT_RARITIES.RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/100', material: 'PS, ABS, PVC', dimensions: 'Approx. 15.5 in box length', weight: '0.82kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/mg-asw-g-08-gundam-barbatos-gp.jpg?v=1737677587',
        publicId: 'source/gundamplanet/mg-gundam-barbatos',
        isMain: true,
      },
    ],
    tags: ['Mikazuki Augus', 'Tekkadan', 'Barbatos', 'Iron-Blooded Orphans'],
  },
  {
    name: 'MG ASW-G-08 Gundam Barbatos Lupus',
    price: 84.95,
    stock: 5,
    description: 'A premium-feeling IBO Master Grade centered on aggressive proportions, updated armament and a more imposing combat silhouette for advanced displays.',
    grade: PRODUCT_GRADES.MG,
    series: 'Mobile Suit Gundam: Iron-Blooded Orphans',
    rarity: PRODUCT_RARITIES.SUPER_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/100', material: 'PS, ABS, PVC', dimensions: 'Approx. 15.7 in box length', weight: '0.98kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/mg-asw-g-08-gundam-barbatos-lupus-base.jpg?v=1763409928',
        publicId: 'source/gundamplanet/mg-gundam-barbatos-lupus',
        isMain: true,
      },
    ],
    tags: ['Mikazuki Augus', 'Barbatos Lupus', 'Tekkadan', 'Iron-Blooded Orphans'],
  },
  {
    name: 'MG RX-93-2 Hi-Nu Gundam Ver.Ka',
    price: 89.95,
    stock: 5,
    description: 'A Ver.Ka centerpiece kit with layered armor, large fin funnel display impact and a classic premium UC engineering profile for showcase shelves.',
    grade: PRODUCT_GRADES.MG,
    series: "Mobile Suit Gundam: Char's Counterattack - Beltorchika's Children",
    rarity: PRODUCT_RARITIES.ULTRA_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/100', material: 'PS, ABS, PP, PET', dimensions: 'Approx. 15.9 in box length', weight: '1.18kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/mg-rx-93-2-hi-nu-gundam-ver-ka-00_1.jpg?v=1737663005',
        publicId: 'source/gundamplanet/mg-hi-nu-gundam-ver-ka',
        isMain: true,
      },
    ],
    tags: ['Amuro Ray', 'Hi-Nu Gundam', 'Ver.Ka', 'Beltorchikas Children'],
  },
  {
    name: 'MGEX Strike Freedom Gundam',
    price: 184.95,
    stock: 3,
    description: 'A luxury-grade SEED release with striking internal finish work, layered gold frame presentation and strong display value as a premium centerpiece kit.',
    grade: PRODUCT_GRADES.MG,
    series: 'Mobile Suit Gundam SEED Destiny',
    rarity: PRODUCT_RARITIES.LEGENDARY,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/100', material: 'PS, ABS, PET', dimensions: 'Approx. 17.7 in box length', weight: '1.8kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/mgex-zgmf-x20a-strike-freedom-gundam-gp.jpg?v=1737709982',
        publicId: 'source/gundamplanet/mgex-strike-freedom-gundam',
        isMain: true,
      },
    ],
    tags: ['Kira Yamato', 'Strike Freedom', 'MGEX', 'SEED Destiny'],
  },
  {
    name: 'PG Unleashed RX-78-2 Gundam',
    price: 298.95,
    stock: 2,
    description: 'A flagship Perfect Grade release with layered build stages, advanced inner structure and showcase-level presence built for serious collector displays.',
    grade: PRODUCT_GRADES.PG,
    series: 'Mobile Suit Gundam',
    rarity: PRODUCT_RARITIES.LEGENDARY,
    condition: PRODUCT_CONDITIONS.MINT,
    specs: { scale: '1/60', material: 'PS, ABS, PET, metal parts', dimensions: 'Approx. 25.6 in box length', weight: '3.9kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/pg-unleashed-rx-78-2-gundam-gp.jpg?v=1737685585',
        publicId: 'source/gundamplanet/pg-unleashed-rx-78-2-gundam',
        isMain: true,
      },
    ],
    tags: ['RX-78-2', 'Amuro Ray', 'Perfect Grade Unleashed', 'Universal Century'],
  },
];

const categoryNameByGrade = {
  [PRODUCT_GRADES.HG]: 'HG - High Grade',
  [PRODUCT_GRADES.RG]: 'RG - Real Grade',
  [PRODUCT_GRADES.MG]: 'MG - Master Grade',
  [PRODUCT_GRADES.PG]: 'PG - Perfect Grade',
};

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('Please run seed:admin first!');
      return;
    }

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing catalog data');

    const createdCategories = await Category.insertMany(CATEGORIES);
    console.log(`Seeded ${createdCategories.length} categories`);

    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category;
      return map;
    }, {});

    const productsToSeed = PRODUCTS.map((product) => {
      const categoryName = categoryNameByGrade[product.grade] || 'Premium / Limited';
      return {
        ...product,
        category: categoryMap[categoryName]._id,
        seller: admin._id,
      };
    });

    await Product.insertMany(productsToSeed);
    console.log(`Seeded ${productsToSeed.length} real-world inspired products`);
    console.log('Data seeding completed');
  } catch (error) {
    console.error('Seed failed:', error);
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedData();
