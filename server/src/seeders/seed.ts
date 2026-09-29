import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db';

import User from '../models/User';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Product from '../models/Product';
import Inventory from '../models/Inventory';
import Coupon from '../models/Coupon';
import Review from '../models/Review';
import Order from '../models/Order';
import Article from '../models/Article';
import Address from '../models/Address';

export const seedDataOnly = async () => {
  try {
    console.log('🌱 Starting GlowCart Comprehensive Database Seed Process...');

    // Clear existing data
    console.log('🧹 Cleaning existing database collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Article.deleteMany({});
    await Address.deleteMany({});

    // 1. Create Users
    console.log('👤 Seeding Users...');
    const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
    const customerPasswordHash = await bcrypt.hash('Password123!', 10);

    const admin = await User.create({
      firstName: 'GlowCart',
      lastName: 'Admin',
      email: 'admin@example.com',
      phone: '+91 9876543210',
      passwordHash: adminPasswordHash,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      isActive: true
    });

    const customer = await User.create({
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'customer@example.com',
      phone: '+91 9812345678',
      passwordHash: customerPasswordHash,
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isActive: true,
      preferences: { skinType: 'Combination', hairType: 'Straight', newsletter: true }
    });

    console.log(`✅ Admin Account: admin@example.com / Admin123!`);
    console.log(`✅ Customer Account: customer@example.com / Password123!`);

    // 2. Create Address for Customer
    await Address.create({
      user: customer._id,
      name: 'Priya Sharma',
      phone: '+91 9812345678',
      addressLine: 'Flat 402, Lotus Apartments, Bandra West',
      apartment: 'Near Hill Road Market',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      addressType: 'Home',
      isDefault: true
    });

    // 3. Create Categories & Subcategories
    console.log('📁 Seeding Categories & Subcategories...');
    const categoriesData = [
      { name: 'Makeup', slug: 'makeup', description: 'Lipstick, Foundation, Eye Makeup & More', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', displayOrder: 1 },
      { name: 'Skincare', slug: 'skincare', description: 'Serums, Moisturizers, Sunscreens & Cleansers', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', displayOrder: 2 },
      { name: 'Haircare', slug: 'haircare', description: 'Shampoos, Oils, Conditioners & Serums', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500', displayOrder: 3 },
      { name: 'Fragrance', slug: 'fragrance', description: 'Luxury Perfumes, Body Mists & Deodorants', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', displayOrder: 4 },
      { name: 'Bath & Body', slug: 'bath-body', description: 'Body Wash, Lotions & Scrubs', image: 'https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=500', displayOrder: 5 },
      { name: 'Wellness', slug: 'wellness', description: 'Beauty Supplements, Teas & Health Drinks', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', displayOrder: 6 },
      { name: 'Personal Care', slug: 'personal-care', description: 'Hygiene, Oral Care & Essentials', image: 'https://images.unsplash.com/photo-1556228722-d1191e921d78?w=500', displayOrder: 7 },
      { name: 'Tools & Appliances', slug: 'tools-appliances', description: 'Hair Straighteners, Dryers & Makeup Brushes', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', displayOrder: 8 }
    ];

    const categoryDocs: Record<string, any> = {};
    for (const cat of categoriesData) {
      const createdCat = await Category.create(cat);
      categoryDocs[cat.slug] = createdCat;
    }

    // Subcategories
    const subcategoriesData = [
      { name: 'Lipstick & Lip Care', slug: 'lipstick-lip-care', parentCategory: categoryDocs['makeup']._id, displayOrder: 1 },
      { name: 'Foundation & Concealer', slug: 'foundation-concealer', parentCategory: categoryDocs['makeup']._id, displayOrder: 2 },
      { name: 'Eye Makeup', slug: 'eye-makeup', parentCategory: categoryDocs['makeup']._id, displayOrder: 3 },
      { name: 'Serums & Essences', slug: 'serums-essences', parentCategory: categoryDocs['skincare']._id, displayOrder: 1 },
      { name: 'Moisturizers & Creams', slug: 'moisturizers-creams', parentCategory: categoryDocs['skincare']._id, displayOrder: 2 },
      { name: 'Sunscreens', slug: 'sunscreens', parentCategory: categoryDocs['skincare']._id, displayOrder: 3 },
      { name: 'Shampoo & Conditioner', slug: 'shampoo-conditioner', parentCategory: categoryDocs['haircare']._id, displayOrder: 1 },
      { name: 'Hair Oils & Masks', slug: 'hair-oils-masks', parentCategory: categoryDocs['haircare']._id, displayOrder: 2 },
      { name: 'Perfumes', slug: 'perfumes', parentCategory: categoryDocs['fragrance']._id, displayOrder: 1 },
      { name: 'Body Lotions', slug: 'body-lotions', parentCategory: categoryDocs['bath-body']._id, displayOrder: 1 }
    ];

    const subcatDocs: Record<string, any> = {};
    for (const sub of subcategoriesData) {
      const createdSub = await Category.create(sub);
      subcatDocs[sub.slug] = createdSub;
    }

    // 4. Create 16 Recognized Brands
    console.log('🏷️ Seeding 16 Iconic Brands...');
    const brandsData = [
      { name: 'MAC Cosmetics', slug: 'mac', logo: 'https://images.unsplash.com/photo-1583241799056-e2d304956d47?w=300', description: 'Professional quality cosmetics for all ages, races and genders.' },
      { name: 'Maybelline New York', slug: 'maybelline', logo: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300', description: 'Trendy, affordable NYC-inspired makeup.' },
      { name: 'Lakmé', slug: 'lakme', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300', description: 'India’s premier cosmetics and beauty brand.' },
      { name: "L'Oréal Paris", slug: 'loreal-paris', logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300', description: 'World leader in beauty, hair & skincare innovation.' },
      { name: 'The Ordinary', slug: 'the-ordinary', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', description: 'Clinical formulations with integrity and scientific clarity.' },
      { name: 'Clinique', slug: 'clinique', logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', description: 'Dermatologist-developed 100% allergy tested skincare.' },
      { name: 'Dior', slug: 'dior', logo: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300', description: 'French haute couture & ultra-luxury beauty icon.' },
      { name: 'YSL Beauty', slug: 'ysl-beauty', logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300', description: 'Edgy luxury makeup, radiance pens & statement fragrances.' },
      { name: 'Clarins', slug: 'clarins', logo: 'https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=300', description: 'Pioneer of French plant-infused skincare & botanical oils.' },
      { name: 'Estée Lauder', slug: 'estee-lauder', logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300', description: 'Global leader in advanced night repair & long-wear makeup.' },
      { name: 'Laneige', slug: 'laneige', logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', description: 'Korean water bank hydration & cult lip sleeping masks.' },
      { name: 'Dot & Key', slug: 'dot-and-key', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300', description: 'Fruit-infused clean vitamin skincare formulas.' },
      { name: 'Forest Essentials', slug: 'forest-essentials', logo: 'https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=300', description: 'Traditional Ayurvedic luxury skincare, haircare & wellness.' },
      { name: 'Plum', slug: 'plum', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300', description: '100% vegan, cruelty-free beauty & skin essentials.' },
      { name: 'Innisfree', slug: 'innisfree', logo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300', description: 'Natural ingredients sourced from Korea’s pristine Jeju Island.' },
      { name: 'Nivea', slug: 'nivea', logo: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300', description: 'Trusted skincare and body care protection for over 100 years.' }
    ];

    const brandDocs: Record<string, any> = {};
    for (const b of brandsData) {
      const createdBrand = await Brand.create(b);
      brandDocs[b.slug] = createdBrand;
    }

    // 5. Seed Authentic Products
    console.log('💄 Seeding Catalog Products across 16 Brands...');

    const productsSeedData = [
      // MAC
      {
        name: 'MAC Matte Lipstick - Ruby Woo',
        slug: 'mac-matte-lipstick-ruby-woo',
        description: 'An iconic vivid blue-red matte shade with long-wearing formula. Provides intense color payoff and non-feathering finish.',
        shortDescription: 'Iconic vivid blue-red ultra-matte lipstick.',
        brand: 'mac', cat: 'makeup', sub: 'lipstick-lip-care',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600', 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600'],
        price: 1950, mrp: 2200, discount: 11, sku: 'MAC-LIP-RUBY-01', stock: 45, rating: 4.8, reviewCount: 342,
        tags: ['lipstick', 'matte', 'red', 'mac', 'bestseller'],
        ingredients: 'Ricinus Communis Seed Oil, Octyldodecanol, Silica, Candelilla Cera.',
        usageInstructions: 'Apply directly from bullet or use a lip brush.',
        highlights: ['12-hour longwear', 'Non-drying matte finish', 'High color intensity'],
        variants: [{ sku: 'MAC-LIP-RUBY-01', name: 'Ruby Woo', type: 'shade', value: '#D01A33', price: 1950, mrp: 2200, stock: 45, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },
      {
        name: 'MAC Studio Fix Fluid SPF 15 Foundation',
        slug: 'mac-studio-fix-fluid-foundation',
        description: 'A modern matte liquid foundation with 24-hour wear and buildable medium-to-full coverage.',
        shortDescription: '24-hour oil-controlling liquid foundation.',
        brand: 'mac', cat: 'makeup', sub: 'foundation-concealer',
        images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600'],
        price: 3300, mrp: 3600, discount: 8, sku: 'MAC-FOUND-NC30', stock: 35, rating: 4.7, reviewCount: 210,
        tags: ['foundation', 'mac', 'studio fix', 'matte'],
        ingredients: 'Water, Cyclopentasiloxane, PEG-10 Dimethicone, Silica.',
        usageInstructions: 'Apply to well-moisturized skin with a foundation brush.',
        highlights: ['24-hour wear', 'Controls shine', 'Non-caking'],
        variants: [{ sku: 'MAC-FOUND-NC30', name: 'NC30 Neutral Golden', type: 'shade', value: '#D8A87F', price: 3300, mrp: 3600, stock: 35, isAvailable: true }],
        isFeatured: false, isBestseller: true, isNewArrival: false
      },
      {
        name: 'MAC Prep + Prime Fix+ Facial Mist',
        slug: 'mac-prep-prime-fix-plus',
        description: 'A lightweight water mist packed with vitamins and minerals to soothe, refresh skin and set makeup.',
        shortDescription: 'Hydrating makeup setting & soothing mist.',
        brand: 'mac', cat: 'makeup', sub: 'foundation-concealer',
        images: ['https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=600'],
        price: 2150, mrp: 2400, discount: 10, sku: 'MAC-FIX-PLUS-100', stock: 50, rating: 4.9, reviewCount: 415,
        tags: ['fix spray', 'setting spray', 'mac', 'hydration'],
        ingredients: 'Water, Glycerin, Butylene Glycol, Chamomilla Recutita Extract.',
        usageInstructions: 'Hold bottle 12 inches away from face and spray evenly.',
        highlights: ['Sets makeup for 12 hours', 'Instant hydration boost', 'Dermatologist tested'],
        variants: [{ sku: 'MAC-FIX-PLUS-100', name: 'Original 100ml', type: 'size', value: '100ml', price: 2150, mrp: 2400, stock: 50, isAvailable: true }],
        isFeatured: true, isBestseller: false, isNewArrival: false
      },

      // MAYBELLINE
      {
        name: 'Maybelline Fit Me Matte + Poreless Liquid Foundation',
        slug: 'maybelline-fit-me-matte-poreless-foundation',
        description: 'Ideal for normal to oily skin, this lightweight foundation refines pores and leaves a natural, seamless matte finish.',
        shortDescription: 'Oil-free lightweight matte liquid foundation.',
        brand: 'maybelline', cat: 'makeup', sub: 'foundation-concealer',
        images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600'],
        price: 599, mrp: 699, discount: 14, sku: 'MAY-FOUND-128', stock: 80, rating: 4.6, reviewCount: 520,
        tags: ['foundation', 'matte', 'maybelline', 'fit me'],
        ingredients: 'Aqua, Cyclohexasiloxane, Nylon-12, Isododecane, Alcohol Denat.',
        usageInstructions: 'Apply to face and blend evenly with fingertips or beauty sponge.',
        highlights: ['Matches skin tone', 'Refines pores', 'All day shine control'],
        variants: [{ sku: 'MAY-FOUND-128', name: '128 Warm Nude', type: 'shade', value: '#E5C09B', price: 599, mrp: 699, stock: 80, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },
      {
        name: 'Maybelline Superstay Matte Ink Liquid Lipstick - Pioneer',
        slug: 'maybelline-superstay-matte-ink-lipstick',
        description: 'Ink your lips in up to 16-hour saturated liquid matte. Features a unique arrow applicator for precise application.',
        shortDescription: '16-hour transfer-proof saturated liquid lipstick.',
        brand: 'maybelline', cat: 'makeup', sub: 'lipstick-lip-care',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
        price: 699, mrp: 799, discount: 12, sku: 'MAY-LIP-PIONEER', stock: 65, rating: 4.7, reviewCount: 610,
        tags: ['lipstick', 'liquid matte', 'maybelline', 'superstay'],
        ingredients: 'Dimethicone, Isododecane, Trimethylsiloxysilicate, Nylon-611.',
        usageInstructions: 'Apply liquid lipstick in the center of your upper lip and follow the contours.',
        highlights: ['16-hour transfer proof', 'Intense pigment', 'Arrow applicator'],
        variants: [{ sku: 'MAY-LIP-PIONEER', name: 'Pioneer Red', type: 'shade', value: '#B2182B', price: 699, mrp: 799, stock: 65, isAvailable: true }],
        isFeatured: false, isBestseller: true, isNewArrival: false
      },

      // LAKME
      {
        name: 'Lakmé Absolute Precision Eye Artist Eyebrow Pencil',
        slug: 'lakme-absolute-eyebrow-pencil',
        description: 'Get defined, natural-looking brows with high color precision and soft smudge-proof application.',
        shortDescription: 'Precision eyebrow pencil with spoolie brush.',
        brand: 'lakme', cat: 'makeup', sub: 'eye-makeup',
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'],
        price: 425, mrp: 500, discount: 15, sku: 'LAK-BROW-DARK', stock: 90, rating: 4.5, reviewCount: 180,
        tags: ['eyebrow', 'lakme', 'pencil', 'eyes'],
        ingredients: 'Hydrogenated Vegetable Oil, Synthetic Beeswax, Carnauba Wax.',
        usageInstructions: 'Use short light strokes to fill in brow sparse areas.',
        highlights: ['Smudge-proof 12h', 'Natural matte finish', 'Built-in spoolie'],
        variants: [{ sku: 'LAK-BROW-DARK', name: 'Dark Brown', type: 'shade', value: '#4A3728', price: 425, mrp: 500, stock: 90, isAvailable: true }],
        isFeatured: false, isBestseller: true, isNewArrival: false
      },
      {
        name: 'Lakmé Lumi Cream Face Highlight Moisturizer',
        slug: 'lakme-lumi-cream-moisturizer',
        description: 'A unique moisturizer with 3D highlight pearls that hydrates skin while giving an instant 3D luminous glow.',
        shortDescription: 'Lightweight moisturizer with instant 3D highlight glow.',
        brand: 'lakme', cat: 'skincare', sub: 'moisturizers-creams',
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
        price: 299, mrp: 349, discount: 14, sku: 'LAK-LUMI-30G', stock: 110, rating: 4.6, reviewCount: 390,
        tags: ['lumi cream', 'moisturizer', 'lakme', 'glow'],
        ingredients: 'Aqua, Glycerin, Niacinamide, Pearl Pigments, Dimethicone.',
        usageInstructions: 'Dot over clean face and massage gently until absorbed.',
        highlights: ['3D Luminous glow', 'Niacinamide enriched', 'Lightweight non-sticky'],
        variants: [{ sku: 'LAK-LUMI-30G', name: '30g Tube', type: 'size', value: '30g', price: 299, mrp: 349, stock: 110, isAvailable: true }],
        isFeatured: true, isBestseller: false, isNewArrival: true
      },

      // LOREAL
      {
        name: "L'Oréal Paris Lash Paradise Mascara",
        slug: 'loreal-paris-lash-paradise-mascara',
        description: 'Take your lashes to paradise with intense volume and breathtaking length. Soft wavy feather brush holds maximum formula.',
        shortDescription: 'Volumizing & lengthening washable mascara.',
        brand: 'loreal-paris', cat: 'makeup', sub: 'eye-makeup',
        images: ['https://images.unsplash.com/photo-1560700321-70e28f09b575?w=600'],
        price: 749, mrp: 899, discount: 16, sku: 'LOR-MASC-BLK', stock: 60, rating: 4.5, reviewCount: 280,
        tags: ['mascara', 'eyes', 'loreal', 'volume'],
        ingredients: 'Isododecane, Cera Alba, Copernicia Cerifera Cera.',
        usageInstructions: 'Wiggle soft brush from lash root to tip.',
        highlights: ['Voluptuous volume', 'Feathery soft lashes', 'No flaking or smudging'],
        variants: [{ sku: 'LOR-MASC-BLK', name: 'Intense Black', type: 'shade', value: '#000000', price: 749, mrp: 899, stock: 60, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },
      {
        name: "L'Oréal Paris Revitalift 1.5% Hyaluronic Acid Serum",
        slug: 'loreal-revitalift-1-5-hyaluronic-acid-serum',
        description: 'Dermatologist validated serum with 1.5% pure Hyaluronic Acid to intensely hydrate and plump skin in 1 hour.',
        shortDescription: '1.5% Pure Hyaluronic Acid radiant hydrating serum.',
        brand: 'loreal-paris', cat: 'skincare', sub: 'serums-essences',
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        price: 999, mrp: 1199, discount: 16, sku: 'LOR-SERUM-HA-30ML', stock: 75, rating: 4.8, reviewCount: 512,
        tags: ['serum', 'hyaluronic acid', 'loreal', 'skincare'],
        ingredients: 'Aqua, Sodium Hyaluronate, Ascorbyl Glucoside, Glycerin.',
        usageInstructions: 'Apply 3-4 drops to cleansed face and neck twice daily.',
        highlights: ['Plumps skin in 1 hour', 'Reduces fine lines by 60%', 'Lightweight non-greasy'],
        variants: [{ sku: 'LOR-SERUM-HA-30ML', name: '30ml Dropper', type: 'size', value: '30ml', price: 999, mrp: 1199, stock: 75, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // THE ORDINARY
      {
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        slug: 'the-ordinary-niacinamide-10-zinc-1',
        description: 'A high-strength vitamin and mineral blemish formula with 10% pure Niacinamide and 1% Zinc PCA.',
        shortDescription: 'High-strength 10% Niacinamide pore refining serum.',
        brand: 'the-ordinary', cat: 'skincare', sub: 'serums-essences',
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        price: 600, mrp: 700, discount: 14, sku: 'ORD-NIAC-30ML', stock: 120, rating: 4.8, reviewCount: 940,
        tags: ['the ordinary', 'niacinamide', 'serum', 'acne'],
        ingredients: 'Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide.',
        usageInstructions: 'Apply to entire face morning and evening before heavier creams.',
        highlights: ['Reduces appearance of skin blemishes', 'Balances sebum activity', 'Alcohol & Oil free'],
        variants: [{ sku: 'ORD-NIAC-30ML', name: '30ml Bottle', type: 'size', value: '30ml', price: 600, mrp: 700, stock: 120, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },
      {
        name: 'The Ordinary AHA 30% + BHA 2% Peeling Solution',
        slug: 'the-ordinary-aha-30-bha-2-peeling-solution',
        description: '10-minute exfoliating facial solution with 30% Alpha Hydroxy Acids and 2% Beta Hydroxy Acid.',
        shortDescription: '10-minute exfoliating chemical peel solution.',
        brand: 'the-ordinary', cat: 'skincare', sub: 'serums-essences',
        images: ['https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=600'],
        price: 950, mrp: 1050, discount: 9, sku: 'ORD-PEEL-30ML', stock: 40, rating: 4.9, reviewCount: 810,
        tags: ['exfoliant', 'aha bha', 'chemical peel', 'the ordinary'],
        ingredients: 'Glycolic Acid, Aqua, Aloe Barbadensis Leaf Water, Salicylic Acid.',
        usageInstructions: 'Use ideally in evening. Do not leave on for more than 10 minutes.',
        highlights: ['Fights visible blemishes', 'Improves skin radiance', 'Smoothes texture'],
        variants: [{ sku: 'ORD-PEEL-30ML', name: '30ml Bottle', type: 'size', value: '30ml', price: 950, mrp: 1050, stock: 40, isAvailable: true }],
        isFeatured: false, isBestseller: true, isNewArrival: false
      },

      // CLINIQUE
      {
        name: 'Clinique Moisture Surge 100H Auto-Replenishing Hydrator',
        slug: 'clinique-moisture-surge-100h-auto-replenishing-hydrator',
        description: 'An oil-free gel-cream moisturizer with exclusive Aloe Bio-ferment + HA Complex that penetrates 10 layers deep.',
        shortDescription: '100-hour oil-free auto-replenishing hydrator.',
        brand: 'clinique', cat: 'skincare', sub: 'moisturizers-creams',
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
        price: 2950, mrp: 3200, discount: 8, sku: 'CLN-MS-50ML', stock: 55, rating: 4.8, reviewCount: 420,
        tags: ['clinique', 'moisture surge', 'hydrator', 'skincare'],
        ingredients: 'Water, Dimethicone, Butylene Glycol, Glycerin, Aloe Barbadensis Leaf Extract.',
        usageInstructions: 'Use morning and night on clean skin.',
        highlights: ['100 hours of stabilizing hydration', 'Aloe Bio-Ferment technology', 'Oil-free gel texture'],
        variants: [{ sku: 'CLN-MS-50ML', name: '50ml Jar', type: 'size', value: '50ml', price: 2950, mrp: 3200, stock: 55, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // DIOR
      {
        name: 'Dior Addict Lip Glow Oil - Rosewood',
        slug: 'dior-addict-lip-glow-oil',
        description: 'A nourishing glossy lip oil enriched with cherry oil that intensely protects, beautifies and enhances natural lip color.',
        shortDescription: 'Nourishing cherry-oil infused glossy lip oil.',
        brand: 'dior', cat: 'makeup', sub: 'lipstick-lip-care',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
        price: 3900, mrp: 4300, discount: 9, sku: 'DIOR-LIP-ROSE', stock: 30, rating: 4.9, reviewCount: 310,
        tags: ['dior', 'lip oil', 'gloss', 'luxury'],
        ingredients: 'Hydrogenated Polyisobutene, Tridecyl Trimellitate, Prunus Avium Seed Oil.',
        usageInstructions: 'Wear alone as a primer or as a top coat for dazzling shine.',
        highlights: ['Infused with Cherry Oil', 'Non-sticky mirror shine', 'Custom color reviver'],
        variants: [{ sku: 'DIOR-LIP-ROSE', name: '012 Rosewood', type: 'shade', value: '#C86D7C', price: 3900, mrp: 4300, stock: 30, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: true
      },
      {
        name: 'Miss Dior Eau de Parfum 50ml',
        slug: 'dior-miss-dior-eau-de-parfum',
        description: 'A couture floral bouquet featuring Centifolia Rose, lily-of-the-valley, and soft peony notes wrapped in tender woods.',
        shortDescription: 'Sensual floral couture perfume with Centifolia Rose.',
        brand: 'dior', cat: 'fragrance', sub: 'perfumes',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'],
        price: 9800, mrp: 10500, discount: 7, sku: 'DIOR-MISS-50ML', stock: 20, rating: 4.9, reviewCount: 195,
        tags: ['dior', 'perfume', 'miss dior', 'fragrance'],
        ingredients: 'Alcohol, Parfum (Fragrance), Aqua (Water), Linalool, Benzyl Salicylate.',
        usageInstructions: 'Spray Miss Dior Eau de Parfum on pulse points: wrists and neck.',
        highlights: ['Handcrafted Couture Bow', 'Long-lasting floral scent', 'Iconic luxury fragrance'],
        variants: [{ sku: 'DIOR-MISS-50ML', name: '50ml Spray', type: 'size', value: '50ml', price: 9800, mrp: 10500, stock: 20, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // YSL BEAUTY
      {
        name: 'YSL Rouge Pur Couture The Slim Matte Lipstick',
        slug: 'ysl-rouge-pur-couture-the-slim-matte-lipstick',
        description: 'An ultra-slim square bullet lipstick that delivers leather-matte color with effortless precision.',
        shortDescription: 'Ultra-slim leather matte high-pigment lipstick.',
        brand: 'ysl-beauty', cat: 'makeup', sub: 'lipstick-lip-care',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
        price: 3800, mrp: 4200, discount: 10, sku: 'YSL-SLIM-21', stock: 25, rating: 4.8, reviewCount: 160,
        tags: ['ysl', 'lipstick', 'matte', 'luxury'],
        ingredients: 'Bis-Diglyceryl Polyacyladipate-2, Dimethicone, Vinyl Dimethicone Crosspolymer.',
        usageInstructions: 'Use the square tip to line cupid bow then fill in lips.',
        highlights: ['High-density color', 'Leather matte finish', 'Precision square bullet'],
        variants: [{ sku: 'YSL-SLIM-21', name: '21 Rouge Paradoxe', type: 'shade', value: '#A6192E', price: 3800, mrp: 4200, stock: 25, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },
      {
        name: 'YSL Black Opium Eau de Parfum 50ml',
        slug: 'ysl-black-opium-eau-de-parfum',
        description: 'The seductive rock-chic fragrance for women. Black coffee and white florals create an addictive gourmand trail.',
        shortDescription: 'Addictive coffee & white floral gourmand perfume.',
        brand: 'ysl-beauty', cat: 'fragrance', sub: 'perfumes',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'],
        price: 9200, mrp: 9900, discount: 7, sku: 'YSL-OPium-50ML', stock: 22, rating: 4.9, reviewCount: 275,
        tags: ['ysl', 'black opium', 'perfume', 'fragrance'],
        ingredients: 'Alcohol, Parfum (Fragrance), Aqua, Benzyl Salicylate, Linalool.',
        usageInstructions: 'Spritz on pulse points for long-lasting intensity.',
        highlights: ['Black coffee accord', 'Sensual vanilla & white flowers', 'Iconic glitter bottle'],
        variants: [{ sku: 'YSL-OPIUM-50ML', name: '50ml Spray', type: 'size', value: '50ml', price: 9200, mrp: 9900, stock: 22, isAvailable: true }],
        isFeatured: false, isBestseller: true, isNewArrival: false
      },

      // CLARINS
      {
        name: 'Clarins Double Serum Complete Age Control Concentrate',
        slug: 'clarins-double-serum-complete-age-control-concentrate',
        description: 'Clarins #1 bestseller. Dual-phase anti-aging serum with 21 potent plant extracts including Turmeric.',
        shortDescription: 'Dual-phase 21 plant extract anti-aging serum.',
        brand: 'clarins', cat: 'skincare', sub: 'serums-essences',
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        price: 6900, mrp: 7500, discount: 8, sku: 'CLR-DS-30ML', stock: 35, rating: 4.9, reviewCount: 380,
        tags: ['clarins', 'double serum', 'anti aging', 'skincare'],
        ingredients: 'Aqua, Cetearyl Isononanoate, Glycerin, Curcuma Longa Root Extract.',
        usageInstructions: 'Mix both phases in palm and press gently onto clean face.',
        highlights: ['Visibly firms skin', 'Smooths wrinkles & boosts radiance', '21 Botanical extracts'],
        variants: [{ sku: 'CLR-DS-30ML', name: '30ml Dual Bottle', type: 'size', value: '30ml', price: 6900, mrp: 7500, stock: 35, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // ESTEE LAUDER
      {
        name: 'Estée Lauder Advanced Night Repair Serum',
        slug: 'estee-lauder-advanced-night-repair-synchronized-multi-recovery-complex',
        description: 'Deep fast night renewal serum with Chronolux Power Signal Technology for radiant, younger-looking skin.',
        shortDescription: 'Revolutionary fast repair and youth-generating serum.',
        brand: 'estee-lauder', cat: 'skincare', sub: 'serums-essences',
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        price: 8900, mrp: 9600, discount: 7, sku: 'EST-ANR-50ML', stock: 40, rating: 4.9, reviewCount: 620,
        tags: ['estee lauder', 'advanced night repair', 'serum', 'skincare'],
        ingredients: 'Water, Bifida Ferment Lysate, Methyl Gluceth-20, Tripeptide-32, Sodium Hyaluronate.',
        usageInstructions: 'Apply AM and PM on clean skin before your moisturizer.',
        highlights: ['8-hour antioxidant protection', '72-hour hydration', 'Reduces lines & pores'],
        variants: [{ sku: 'EST-ANR-50ML', name: '50ml Dropper', type: 'size', value: '50ml', price: 8900, mrp: 9600, stock: 40, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // LANEIGE
      {
        name: 'Laneige Lip Sleeping Mask - Berry',
        slug: 'laneige-lip-sleeping-mask-berry',
        description: 'An overnight lip mask that delivers intense moisture and antioxidants while you sleep with Berry Fruit Complex.',
        shortDescription: 'Nourishing overnight berry lip treatment mask.',
        brand: 'laneige', cat: 'skincare', sub: 'lipstick-lip-care',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
        price: 1450, mrp: 1600, discount: 9, sku: 'LAN-LIP-20G', stock: 100, rating: 4.9, reviewCount: 880,
        tags: ['laneige', 'lip mask', 'berry', 'k-beauty'],
        ingredients: 'Diisostearyl Malate, Hydrogenated Polyisobutene, Phytosteryl Canola Glycerides.',
        usageInstructions: 'Apply generously to lips before bed using built-in spatula.',
        highlights: ['Melts dead skin cells', 'Vitamin C & Antioxidant rich', 'Soft smooth lips by morning'],
        variants: [{ sku: 'LAN-LIP-20G', name: '20g Jar', type: 'size', value: '20g', price: 1450, mrp: 1600, stock: 100, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // DOT & KEY
      {
        name: 'Dot & Key Watermelon Cooling Sunscreen SPF 50 PA+++',
        slug: 'dot-and-key-watermelon-cooling-sunscreen-spf50',
        description: 'Lightweight fluid sunscreen infused with Watermelon and Hyaluronic Acid that cools skin by 2°C instantly.',
        shortDescription: 'Instant cooling zero-whitecast fluid sunscreen SPF 50.',
        brand: 'dot-and-key', cat: 'skincare', sub: 'sunscreens',
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
        price: 495, mrp: 595, discount: 17, sku: 'DOT-SUN-50G', stock: 140, rating: 4.7, reviewCount: 450,
        tags: ['dot and key', 'sunscreen', 'spf 50', 'cooling'],
        ingredients: 'Aqua, Ethylhexyl Methoxycinnamate, Watermelon Fruit Extract, Hyaluronic Acid.',
        usageInstructions: 'Apply generously 15 minutes before sun exposure.',
        highlights: ['Cools skin instantly by 2°C', 'No white cast', 'Water resistant SPF 50'],
        variants: [{ sku: 'DOT-SUN-50G', name: '50g Tube', type: 'size', value: '50g', price: 495, mrp: 595, stock: 140, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: true
      },

      // FOREST ESSENTIALS
      {
        name: 'Forest Essentials Soundarya Radiance Cream with 24K Gold',
        slug: 'forest-essentials-soundarya-radiance-cream-with-24k-gold',
        description: 'An Ayurvedic face cream infused with 24K pure Gold bhasma and saffron that restores elasticity and youthful glow.',
        shortDescription: 'Ayurvedic 24K pure gold radiance day cream.',
        brand: 'forest-essentials', cat: 'skincare', sub: 'moisturizers-creams',
        images: ['https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=600'],
        price: 5800, mrp: 6200, discount: 6, sku: 'FE-SOUND-50G', stock: 25, rating: 4.9, reviewCount: 290,
        tags: ['ayurveda', 'forest essentials', '24k gold', 'radiance'],
        ingredients: '24K Gold Bhasma, Sesame Seed Oil, Kashmiri Saffron, Milk Protein.',
        usageInstructions: 'Take a small amount and massage into clean skin daily.',
        highlights: ['Infused with 24K Pure Gold', 'SPF 25 natural sun protection', 'Deep nourishment'],
        variants: [{ sku: 'FE-SOUND-50G', name: '50g Jar', type: 'size', value: '50g', price: 5800, mrp: 6200, stock: 25, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // PLUM
      {
        name: 'Plum 15% Vitamin C Face Serum with Mandarin',
        slug: 'plum-15-vitamin-c-face-serum',
        description: 'Quick-absorbing 15% Ethyl Ascorbic Acid serum with Japanese Mandarin extract to fade dark spots and boost collagen.',
        shortDescription: '15% Ethyl Ascorbic Acid spot-correcting serum.',
        brand: 'plum', cat: 'skincare', sub: 'serums-essences',
        images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600'],
        price: 550, mrp: 650, discount: 15, sku: 'PLM-VITC-30ML', stock: 95, rating: 4.6, reviewCount: 510,
        tags: ['plum', 'vitamin c', 'serum', 'vegan'],
        ingredients: 'Aqua, Ethyl Ascorbic Acid, Citrus Reticulata Peel Extract, Rosa Damascena Extract.',
        usageInstructions: 'Apply 3-4 drops onto face daily before moisturising.',
        highlights: ['100% Vegan & Cruelty-Free', 'Fades dark spots in 2 weeks', 'Stabilized Vitamin C'],
        variants: [{ sku: 'PLM-VITC-30ML', name: '30ml Dropper', type: 'size', value: '30ml', price: 550, mrp: 650, stock: 95, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: true
      },

      // INNISFREE
      {
        name: 'Innisfree Jeju Green Tea Seed Hyaluronic Serum',
        slug: 'innisfree-jeju-green-tea-seed-serum',
        description: 'Intense moisture serum infused with 100% organic Jeju Green Tea tri-biotics & 5 types of hyaluronic acid.',
        shortDescription: 'Jeju Green Tea tri-biotics hydrating serum.',
        brand: 'innisfree', cat: 'skincare', sub: 'serums-essences',
        images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'],
        price: 2100, mrp: 2300, discount: 9, sku: 'INN-GT-80ML', stock: 65, rating: 4.8, reviewCount: 370,
        tags: ['innisfree', 'green tea', 'jeju', 'serum'],
        ingredients: 'Water, Propanediol, Glycerin, Camellia Sinensis Seed Oil.',
        usageInstructions: 'Apply immediately after cleansing for instant hydration.',
        highlights: ['Jeju Green Tea Tri-biotics', '224% moisture boost', 'Calms irritated skin barrier'],
        variants: [{ sku: 'INN-GT-80ML', name: '80ml Pump', type: 'size', value: '80ml', price: 2100, mrp: 2300, stock: 65, isAvailable: true }],
        isFeatured: true, isBestseller: true, isNewArrival: false
      },

      // NIVEA
      {
        name: 'Nivea Soft Light Moisturizing Cream 200ml',
        slug: 'nivea-soft-light-moisturizing-cream',
        description: 'An invigorating soft cream with Vitamin E and Jojoba Oil that absorbs quickly for refreshed, soft skin.',
        shortDescription: 'Lightweight Vitamin E & Jojoba all-purpose cream.',
        brand: 'nivea', cat: 'bath-body', sub: 'body-lotions',
        images: ['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600'],
        price: 299, mrp: 349, discount: 14, sku: 'NIV-SOFT-200ML', stock: 150, rating: 4.7, reviewCount: 820,
        tags: ['nivea', 'soft cream', 'moisturizer', 'body care'],
        ingredients: 'Aqua, Glycerin, Paraffinum Liquidum, Myristyl Alcohol, Jojoba Seed Oil, Tocopheryl Acetate.',
        usageInstructions: 'Massage daily over face, hands, and body.',
        highlights: ['Quick absorbing soft cream', 'Vitamin E & Jojoba Oil', 'All skin types'],
        variants: [{ sku: 'NIV-SOFT-200ML', name: '200ml Tub', type: 'size', value: '200ml', price: 299, mrp: 349, stock: 150, isAvailable: true }],
        isFeatured: false, isBestseller: true, isNewArrival: false
      }
    ];

    // Generate additional products per brand to reach 10+ items per major brand
    const extraProductTemplates = [
      { name: "Satin Matte Lipstick", cat: "makeup", sub: "lipstick-lip-care", price: 1250, mrp: 1400, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600" },
      { name: "Radiant Skin Perfecting Foundation", cat: "makeup", sub: "foundation-concealer", price: 1850, mrp: 2100, img: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600" },
      { name: "Hydrating Water Essence", cat: "skincare", sub: "serums-essences", price: 1450, mrp: 1650, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600" },
      { name: "Barrier Repair Cream", cat: "skincare", sub: "moisturizers-creams", price: 1650, mrp: 1850, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600" },
      { name: "UV Shield SPF 50 Sunscreen", cat: "skincare", sub: "sunscreens", price: 890, mrp: 990, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600" },
      { name: "Nourishing Hair Treatment Oil", cat: "haircare", sub: "hair-oils-masks", price: 950, mrp: 1100, img: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600" },
      { name: "Signature Eau De Parfum", cat: "fragrance", sub: "perfumes", price: 4500, mrp: 4900, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600" },
      { name: "Silk Smooth Body Lotion", cat: "bath-body", sub: "body-lotions", price: 750, mrp: 850, img: "https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=600" }
    ];

    let fullProductList = [...productsSeedData];
    let counter = 10;

    const brandKeys = Object.keys(brandDocs);
    for (const bSlug of brandKeys) {
      for (const tmpl of extraProductTemplates) {
        counter++;
        const pName = `${brandDocs[bSlug].name} ${tmpl.name} Edition ${counter}`;
        const pSlug = `${bSlug}-${tmpl.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${counter}`;
        
        fullProductList.push({
          name: pName,
          slug: pSlug,
          description: `High performance ${tmpl.name} formulated by ${brandDocs[bSlug].name} for luxury results and daily beauty care.`,
          shortDescription: `Luxury ${tmpl.cat} essential by ${brandDocs[bSlug].name}.`,
          brand: bSlug,
          cat: tmpl.cat,
          sub: tmpl.sub,
          images: [tmpl.img],
          price: tmpl.price + (counter * 5),
          mrp: tmpl.mrp + (counter * 5),
          discount: 10,
          sku: `SKU-${bSlug.toUpperCase()}-${counter}-${Math.floor(1000 + Math.random() * 9000)}`,
          stock: 35 + (counter % 30),
          rating: Number((4.1 + (counter % 9) * 0.1).toFixed(1)),
          reviewCount: 30 + counter * 3,
          tags: [tmpl.cat, bSlug, 'beauty', 'glowcart'],
          ingredients: 'Dermatologically tested luxury beauty formulation.',
          usageInstructions: 'Apply as part of your regular beauty care routine.',
          highlights: ['Dermatologically Tested', 'Authentic Formulation', 'Long-wearing'],
          variants: [
            { sku: `VAR-${bSlug.toUpperCase()}-${counter}`, name: 'Standard Pack', type: 'default', value: 'Default', price: tmpl.price + (counter * 5), mrp: tmpl.mrp + (counter * 5), stock: 35, isAvailable: true }
          ],
          isFeatured: counter % 4 === 0,
          isBestseller: counter % 3 === 0,
          isNewArrival: counter % 5 === 0
        });
      }
    }

    const createdProducts = [];
    for (const p of fullProductList) {
      const brandId = brandDocs[p.brand]._id;
      const catId = categoryDocs[p.cat]._id;
      const subId = subcatDocs[p.sub]._id;

      const prodData = {
        ...p,
        brand: brandId,
        category: catId,
        subcategory: subId
      };

      const prodDoc = await Product.create(prodData);
      createdProducts.push(prodDoc);

      // Create Inventory record for master SKU
      await Inventory.create({
        sku: prodDoc.sku,
        product: prodDoc._id,
        availableStock: prodDoc.stock,
        reservedStock: 0,
        lowStockThreshold: 10,
        status: prodDoc.stock > 10 ? 'In Stock' : prodDoc.stock > 0 ? 'Low Stock' : 'Out of Stock'
      });
    }

    console.log(`✅ Total Seeded Products: ${createdProducts.length}`);

    // 6. Create Coupons
    console.log('🎟️ Seeding Coupons...');
    const createdCoupons = await Coupon.create([
      {
        code: 'BEAUTY20',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderValue: 999,
        maximumDiscount: 500,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        active: true
      },
      {
        code: 'GLOW10',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderValue: 499,
        maximumDiscount: 250,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        active: true
      },
      {
        code: 'WELCOME500',
        discountType: 'fixed',
        discountValue: 500,
        minimumOrderValue: 1999,
        expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        active: true
      }
    ]);

    // 7. Seed Reviews
    console.log('⭐ Seeding Reviews...');
    const sampleProduct1 = createdProducts[0];
    const sampleProduct2 = createdProducts[1];
    const sampleProduct3 = createdProducts[2];

    const createdReviews = await Review.create([
      {
        product: sampleProduct1._id,
        user: customer._id,
        rating: 5,
        title: 'Absolute holy grail red lipstick!',
        comment: 'Ruby Woo is hands down the best classic matte red lipstick ever made. Long lasting and stays through meals!',
        isVerifiedPurchase: true,
        helpfulVotes: 24,
        status: 'Approved'
      },
      {
        product: sampleProduct2._id,
        user: customer._id,
        rating: 5,
        title: 'Perfect natural matte finish',
        comment: 'Fits my skin tone perfectly and controls oil throughout the hot day. Highly recommended!',
        isVerifiedPurchase: true,
        helpfulVotes: 12,
        status: 'Approved'
      },
      {
        product: sampleProduct3._id,
        user: customer._id,
        rating: 5,
        title: 'Holy grail makeup setting mist',
        comment: 'Fix+ locks in my makeup all day and gives a glowing dewy finish. Must buy!',
        isVerifiedPurchase: true,
        helpfulVotes: 18,
        status: 'Approved'
      }
    ]);

    // 8. Seed Beauty Content Articles
    console.log('📰 Seeding Beauty Advice Articles...');
    await Article.create([
      {
        title: 'The Ultimate 10-Step Glass Skin Routine Guide',
        slug: 'ultimate-10-step-glass-skin-routine',
        excerpt: 'Discover how K-beauty double cleansing, essences, and niacinamide lock in luminous moisture for translucent glass skin.',
        content: `Glass skin isn't about perfection; it's about intense hydration and skin barrier support. Step 1: Oil cleansing to remove sunscreen and makeup. Step 2: Water-based gentle cleanser. Step 3: Exfoliate twice weekly with AHAs. Step 4: Hydrating toner layers. Step 5: Niacinamide serum for pore refinement. Step 6: Moisture surge cream. Step 7: Daily broad-spectrum SPF 50+.`,
        bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
        author: 'Dr. Ananya Roy (Dermatologist)',
        category: 'Skincare',
        tags: ['skincare', 'glass skin', 'k-beauty', 'serums'],
        readTimeMinutes: 5,
        isPublished: true
      },
      {
        title: 'Finding Your Perfect Foundation Undertone in 3 Easy Steps',
        slug: 'finding-your-perfect-foundation-undertone',
        excerpt: 'Stop wearing ghostly or orange foundation! Learn the vein test and jewelry rule to find warm, cool, or neutral shades.',
        content: `Matching foundation isn't just about shade depth, it's about undertones! Look at your wrist veins under natural sunlight. Blue or purple veins indicate Cool undertones. Greenish veins mean Warm undertones. If you can't tell, you are likely Neutral. Always swatch foundation along your jawline!`,
        bannerImage: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800',
        author: 'Rohan Mehta (Master Makeup Artist)',
        category: 'Makeup',
        tags: ['foundation', 'makeup tips', 'undertones'],
        readTimeMinutes: 4,
        isPublished: true
      }
    ]);

    // 9. Seed Sample Customer Order
    console.log('📦 Seeding Sample Customer Order...');
    await Order.create({
      orderNumber: 'GLOW-ORD-90210',
      user: customer._id,
      items: [
        {
          product: sampleProduct1._id,
          variantId: sampleProduct1.variants[0]._id?.toString(),
          variantName: sampleProduct1.variants[0].name,
          name: sampleProduct1.name,
          price: sampleProduct1.price,
          quantity: 1,
          image: sampleProduct1.images[0]
        }
      ],
      itemsPrice: sampleProduct1.price,
      discountAmount: 200,
      couponCode: 'GLOW10',
      deliveryFee: 0,
      totalAmount: sampleProduct1.price - 200,
      shippingAddress: {
        name: 'Priya Sharma',
        phone: '+91 9812345678',
        addressLine: 'Flat 402, Lotus Apartments, Bandra West',
        apartment: 'Near Hill Road Market',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India'
      },
      paymentMethod: 'COD',
      paymentStatus: 'Completed',
      orderStatus: 'Out for delivery',
      trackingNumber: 'AWB-GLOW-789012',
      expectedDeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 48 * 3600 * 1000), note: 'Order placed' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 36 * 3600 * 1000), note: 'Payment verified' },
        { status: 'Processing', timestamp: new Date(Date.now() - 24 * 3600 * 1000), note: 'Packed at GlowCart Hub' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 12 * 3600 * 1000), note: 'In transit with courier' },
        { status: 'Out for delivery', timestamp: new Date(), note: 'Agent on the way' }
      ]
    });

    console.log('🎉 GlowCart Database Seed Completed Successfully!');
    console.log('================================================');
    console.log(`Brands: ${Object.keys(brandDocs).length}`);
    console.log(`Categories: ${Object.keys(categoryDocs).length + Object.keys(subcatDocs).length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Coupons: ${createdCoupons.length}`);
    console.log(`Reviews: ${createdReviews.length}`);
    console.log('================================================');
  } catch (error: any) {
    console.error('❌ Database Seed Failed:', error);
    throw error;
  }
};

export const seedDatabase = async () => {
  try {
    await connectDB();
    await seedDataOnly();
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

