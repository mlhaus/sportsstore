#!/usr/bin/env node

/**
 * Seed MongoDB Atlas with initial product data
 * 
 * Usage: 
 *   Set MONGODB_URI environment variable
 *   npm install mongoose
 *   node seed-mongodb.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('❌ Error: MONGODB_URI environment variable not set');
    console.error('Set it and try again:');
    console.error('  export MONGODB_URI="your-connection-string"');
    process.exit(1);
}

async function seed() {
    try {
        console.log('📍 Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUri, {
            dbName: 'sportsstore'
        });
        console.log('✅ Connected to MongoDB');

        // Read seed data
        const seedPath = path.join(__dirname, 'products.json');
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
        
        // Define schemas
        const supplierSchema = new mongoose.Schema({}, { strict: false });
        const categorySchema = new mongoose.Schema({}, { strict: false });
        const productSchema = new mongoose.Schema({}, { strict: false });

        const Supplier = mongoose.model('Supplier', supplierSchema);
        const Category = mongoose.model('Category', categorySchema);
        const Product = mongoose.model('Product', productSchema);

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Supplier.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Insert seed data
        console.log('📝 Inserting seed data...');
        await Supplier.insertMany(seedData.suppliers);
        console.log(`  ✅ ${seedData.suppliers.length} suppliers`);
        
        await Category.insertMany(seedData.categories);
        console.log(`  ✅ ${seedData.categories.length} categories`);
        
        await Product.insertMany(seedData.products);
        console.log(`  ✅ ${seedData.products.length} products`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('Your Vercel app can now run without file-based seeding.');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seed();
