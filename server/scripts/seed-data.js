const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../src/modules/product/category.model');
const Product = require('../src/modules/product/product.model');
const User = require('../src/modules/user/user.model');
const { PRODUCT_GRADES, PRODUCT_RARITIES, PRODUCT_CONDITIONS } = require('../src/shared/constants/productConstants');

const CATEGORIES = [
  { name: 'HG - High Grade', description: 'Standard 1/144 scale models' },
  { name: 'RG - Real Grade', description: 'High detail 1/144 scale models' },
  { name: 'MG - Master Grade', description: 'Internal frame 1/100 scale models' },
  { name: 'PG - Perfect Grade', description: 'The pinnacle 1/60 scale models' },
  { name: 'Metal Build', description: 'Pre-assembled high-end figures' },
  { name: 'Tools & Acc', description: 'Nippers, paints, and decals' },
];

const PRODUCTS = [
  {
    name: 'RX-93 v Gundam (Nu Gundam) Ver. Ka',
    price: 95,
    stock: 12,
    description: 'The legendary Nu Gundam piloted by Amuro Ray. This Ver. Ka edition features extreme detail and psycho-frame illumination.',
    grade: PRODUCT_GRADES.MG,
    series: 'Mobile Suit Gundam: Chars Counterattack',
    rarity: PRODUCT_RARITIES.SUPER_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/100', material: 'PS, ABS, PP, PET', weight: '1.2kg' },
    images: [{ url: '/images/products/nu-gundam.png', publicId: 'local/nu-gundam', isMain: true }],
    tags: ['Amuro', 'Londo Bell', 'Universal Century'],
  },
  {
    name: 'ASW-G-08 Gundam Barbatos Lupus Rex',
    price: 65,
    stock: 8,
    description: 'The final form of Mikazuki Augus Barbatos. Savage claw-like hands and mace tail included.',
    grade: PRODUCT_GRADES.MG,
    series: 'Iron-Blooded Orphans',
    rarity: PRODUCT_RARITIES.RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/100', material: 'ABS, PVC', weight: '0.8kg' },
    images: [{ url: '/images/products/barbatos.png', publicId: 'local/barbatos', isMain: true }],
    tags: ['Tekkadan', 'Post Disaster'],
  },
  {
    name: 'ZGMF-X20A Strike Freedom Gundam',
    price: 180,
    stock: 5,
    description: 'Perfect Grade Strike Freedom with gold plated internal frame parts and wings of light effect.',
    grade: PRODUCT_GRADES.PG,
    series: 'Gundam Seed Destiny',
    rarity: PRODUCT_RARITIES.LEGENDARY,
    condition: PRODUCT_CONDITIONS.MINT,
    specs: { scale: '1/60', material: 'PC, ABS, PVC', weight: '3.5kg' },
    images: [{ url: '/images/products/strike-freedom.png', publicId: 'local/strike-freedom', isMain: true }],
    tags: ['Kira Yamato', 'Orb', 'Dragoon System'],
  },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get Admin User as default seller
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('Please run seed:admin first!');
      return;
    }

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create Categories
    const createdCategories = await Category.insertMany(CATEGORIES);
    console.log(`Seeded ${createdCategories.length} categories`);

    // Assign products to a random category
    const productsToSeed = PRODUCTS.map((p, idx) => ({
      ...p,
      category: createdCategories[idx % createdCategories.length]._id,
      seller: admin._id,
    }));

    await Product.insertMany(productsToSeed);
    console.log(`Seeded ${productsToSeed.length} products`);

    console.log('Data Seeding Completed!');
  } catch (error) {
    console.error('Seed failed:', error);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedData();
