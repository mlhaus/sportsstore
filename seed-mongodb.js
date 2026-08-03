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
        const supplierSchema = new mongoose.Schema({
            name: { type: String, required: true }
        });
        const categorySchema = new mongoose.Schema({
            name: { type: String, required: true }
        });
        const productSchema = new mongoose.Schema({
            name: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
            supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
        });

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
        const insertedSuppliers = await Supplier.insertMany(
            seedData.suppliers.map((supplier) => ({
                name: supplier.name
            }))
        );
        console.log(`  ✅ ${insertedSuppliers.length} suppliers`);
        
        const insertedCategories = await Category.insertMany(
            seedData.categories.map((category) => ({
                name: category.name
            }))
        );
        console.log(`  ✅ ${insertedCategories.length} categories`);

        const supplierIds = new Map(
            seedData.suppliers.map((supplier, index) => [supplier.id, insertedSuppliers[index]._id])
        );
        const categoryIds = new Map(
            seedData.categories.map((category, index) => [category.id, insertedCategories[index]._id])
        );

        const insertedProducts = await Product.insertMany(
            seedData.products.map((product) => ({
                name: product.name,
                description: product.description,
                price: product.price,
                categoryId: categoryIds.get(product.categoryId),
                supplierId: supplierIds.get(product.supplierId)
            }))
        );
        console.log(`  ✅ ${insertedProducts.length} products`);

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
