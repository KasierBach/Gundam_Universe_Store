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

// Price references were checked from Gundam Planet product listings on April 5, 2026.
// Prices and availability may change, so these are treated as realistic seed references.
const PRODUCTS = [
  {
    name: 'HG Gundam Aerial Rebuild',
    price: 22.95,
    stock: 18,
    description: 'A fast, approachable Witch from Mercury kit with updated backpack equipment, clean color separation and strong poseability for a high-grade build.',
    descriptionVi: 'Một mẫu Witch from Mercury dễ tiếp cận, sở hữu backpack nâng cấp, tách màu sạch và độ linh hoạt tốt, rất hợp cho người chơi muốn có một HG đẹp và dễ trưng bày.',
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
    descriptionVi: 'Mẫu kit cuối tuyến của Witch from Mercury với vũ khí dạng chổi đặc trưng, hiệu ứng shell unit nổi bật và giá trị trưng bày rất cao trong phân khúc HG.',
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
    name: 'HG Gundam Schwarzette',
    price: 24.95,
    stock: 12,
    description: 'A dramatic late-line Witch from Mercury high grade with broad sword equipment, angular armor surfaces and strong shelf impact for a compact 1/144 display.',
    descriptionVi: 'Mẫu HG ấn tượng ở cuối dòng Witch from Mercury với đại kiếm bản lớn, giáp góc cạnh mạnh mẽ và ngoại hình nổi bật dù chỉ ở tỷ lệ 1/144.',
    grade: PRODUCT_GRADES.HG,
    series: 'Mobile Suit Gundam: The Witch from Mercury',
    rarity: PRODUCT_RARITIES.RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, PE', dimensions: 'Approx. 12.5 in box length', weight: '0.36kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/hg-gundam-schwarzette-00001.jpg?v=1737716034',
        publicId: 'source/gundamplanet/hg-gundam-schwarzette',
        isMain: true,
      },
    ],
    tags: ['Schwarzette', 'Witch from Mercury', 'Jeturk', 'Large sword'],
  },
  {
    name: 'HGCE ZGMF-X20A Strike Freedom Gundam',
    price: 24.95,
    stock: 15,
    description: 'A refreshed Cosmic Era high grade with gold frame highlights, iconic wing silhouette and a clean build profile that still reads premium on display.',
    descriptionVi: 'Phiên bản HGCE làm mới của Strike Freedom với điểm nhấn khung vàng, silhouette cánh mang tính biểu tượng và tổng thể lên dáng rất sang khi trưng bày.',
    grade: PRODUCT_GRADES.HG,
    series: 'Mobile Suit Gundam SEED Destiny',
    rarity: PRODUCT_RARITIES.RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, PE', dimensions: 'Approx. 12.3 in box length', weight: '0.34kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/hgce-zgmf-x20a-strike-freedom-gundam-revive-01.jpg?v=1737665029',
        publicId: 'source/gundamplanet/hgce-strike-freedom',
        isMain: true,
      },
    ],
    tags: ['Kira Yamato', 'Strike Freedom', 'Cosmic Era', 'Dragoon'],
  },
  {
    name: 'HGCE STTS-808 Immortal Justice Gundam',
    price: 26.95,
    stock: 11,
    description: 'A modern SEED Freedom line release with aggressive flight mode styling, strong color breakup and a silhouette that looks especially sharp in aerial poses.',
    descriptionVi: 'Một mẫu kit hiện đại thuộc dòng SEED Freedom với form bay tấn công, phối màu rõ mảng và tư thế trên không cực kỳ bắt mắt khi dựng pose.',
    grade: PRODUCT_GRADES.HG,
    series: 'Mobile Suit Gundam SEED Freedom',
    rarity: PRODUCT_RARITIES.RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, PE', dimensions: 'Approx. 12.8 in box length', weight: '0.37kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/re_hg-immortal-justice-gundam-00001.jpg?v=1737728207',
        publicId: 'source/gundamplanet/hgce-immortal-justice',
        isMain: true,
      },
    ],
    tags: ['Shinn Asuka', 'Immortal Justice', 'SEED Freedom', 'Flight mode'],
  },
  {
    name: 'HGCE ZGMF/A-262PD-P Mighty Strike Freedom Gundam',
    price: 34.95,
    stock: 8,
    description: 'A flashy SEED Freedom kit that pushes the wing silhouette further with premium visual presence, effect-driven posing potential and collector appeal above a standard HG.',
    descriptionVi: 'Mẫu SEED Freedom nổi bật với bộ cánh mở rộng hơn, độ hiện diện cao trên kệ, khả năng tạo dáng giàu hiệu ứng và sức hút sưu tầm vượt mặt HG thông thường.',
    grade: PRODUCT_GRADES.HG,
    series: 'Mobile Suit Gundam SEED Freedom',
    rarity: PRODUCT_RARITIES.SUPER_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, PE', dimensions: 'Approx. 13.0 in box length', weight: '0.42kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/th_hgce-zgmf-a-262pd-p-mighty-strike-freedom-gundam-00001.jpg?v=1737734523',
        publicId: 'source/gundamplanet/hgce-mighty-strike-freedom',
        isMain: true,
      },
    ],
    tags: ['Kira Yamato', 'Mighty Strike Freedom', 'SEED Freedom', 'Dragoon'],
  },
  {
    name: 'RG RX-93 Nu Gundam',
    price: 56.95,
    stock: 9,
    description: 'A highly regarded Real Grade release with refined articulation, layered armor separation and a balanced silhouette that makes it a standout UC display kit.',
    descriptionVi: 'Một trong những mẫu Real Grade được đánh giá cao nhất, với khớp cử động tinh chỉnh tốt, giáp nhiều lớp và silhouette cân đối rất hợp cho fan Universal Century.',
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
    name: 'RG OZ-13MS Gundam Epyon',
    price: 54.95,
    stock: 7,
    description: 'A sleek modern Real Grade with whip and sword loadout, transformable presence and a dramatic silhouette that makes it a standout AC-era display unit.',
    descriptionVi: 'Mẫu RG hiện đại của Epyon với roi nhiệt, kiếm lớn, dáng chuyển trạng thái mạnh mẽ và silhouette cực kỳ kịch tính cho fan Gundam Wing.',
    grade: PRODUCT_GRADES.RG,
    series: 'Mobile Suit Gundam Wing',
    rarity: PRODUCT_RARITIES.SUPER_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: '1/144', material: 'PS, ABS, PP', dimensions: 'Approx. 14.2 in box length', weight: '0.49kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/rg-oz-13ms-gundam-epyon-00001.jpg?v=1737721287',
        publicId: 'source/gundamplanet/rg-gundam-epyon',
        isMain: true,
      },
    ],
    tags: ['Zechs Merquise', 'Gundam Wing', 'Epyon', 'Beam sword'],
  },
  {
    name: 'RG GF13-017NJII God Gundam',
    price: 50.95,
    stock: 7,
    description: 'An articulation-focused Real Grade built around martial-arts posing, effect parts and one of the most dynamic silhouettes in the entire RG line.',
    descriptionVi: 'Real Grade tập trung mạnh vào articulation, cực hợp cho pose võ thuật, dùng effect parts đẹp và sở hữu một trong những silhouette năng động nhất toàn dòng RG.',
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
    descriptionVi: 'Mẫu RG cỡ lớn với lượng giáp dày, cảm giác cơ khí cao cấp và độ hiện diện cực mạnh, rất phù hợp với bộ sưu tập Universal Century thiên về Char.',
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
    name: 'MGSD Freedom Gundam',
    price: 54.95,
    stock: 9,
    description: 'A premium super-deformed release with dense surface detail, metallic accents and an unexpectedly high-end build feel that appeals to both SD fans and collectors.',
    descriptionVi: 'Một mẫu MGSD cao cấp với bề mặt dày chi tiết, điểm nhấn metallic đẹp mắt và trải nghiệm lắp ráp vượt kỳ vọng cho cả fan SD lẫn người sưu tầm.',
    grade: PRODUCT_GRADES.SD,
    series: 'Mobile Suit Gundam SEED',
    rarity: PRODUCT_RARITIES.SUPER_RARE,
    condition: PRODUCT_CONDITIONS.NEW,
    specs: { scale: 'SD', material: 'PS, ABS', dimensions: 'Approx. 12.6 in box length', weight: '0.44kg' },
    images: [
      {
        url: 'https://www.gundamplanet.com/cdn/shop/files/mgsd-freedom-gundam-01.jpg?v=1737713041',
        publicId: 'source/gundamplanet/mgsd-freedom-gundam',
        isMain: true,
      },
    ],
    tags: ['Kira Yamato', 'SD', 'MGSD', 'Freedom Gundam'],
  },
  {
    name: 'MG ASW-G-08 Gundam Barbatos',
    price: 60.95,
    stock: 10,
    description: 'A modern Master Grade with exposed frame detail, crisp color separation and a straightforward build that works well for both collectors and custom painters.',
    descriptionVi: 'Master Grade hiện đại của Barbatos với phần khung lộ đẹp, tách màu tốt và quá trình lắp ráp mạch lạc, phù hợp cả người sưu tầm lẫn người thích custom sơn sửa.',
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
    descriptionVi: 'Mẫu MG mang cảm giác cao cấp của dòng IBO với tỷ lệ thân máy dữ dằn hơn, trang bị nâng cấp và silhouette chiến đấu áp đảo cho các kệ trưng bày lớn.',
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
    descriptionVi: 'Một kit Ver.Ka mang tính centerpiece với giáp nhiều lớp, dàn fin funnel cực kỳ nổi bật và chất cơ khí Universal Century cao cấp cho tủ trưng bày.',
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
    descriptionVi: 'Phiên bản MGEX đẳng cấp của Strike Freedom với hoàn thiện nội khung cực ấn tượng, lớp khung vàng nhiều tầng và giá trị trưng bày rất cao ở phân khúc premium.',
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
    descriptionVi: 'Mẫu Perfect Grade Unleashed đầu bảng với quy trình lắp nhiều tầng, inner frame rất sâu và độ hiện diện ở cấp độ showcase dành cho người sưu tầm nghiêm túc.',
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
