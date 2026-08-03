#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy products.json
const productsSource = path.join(__dirname, '..', 'products.json');
const productsDest = path.join(distDir, 'products.json');
if (fs.existsSync(productsSource)) {
    fs.copyFileSync(productsSource, productsDest);
    console.log('✓ Copied products.json to dist/');
} else {
    console.warn('⚠ products.json not found in project root');
}

// Copy server config files
const configSource = path.join(__dirname, '..', 'server.config.json');
const configDest = path.join(distDir, 'server.config.json');
if (fs.existsSync(configSource)) {
    fs.copyFileSync(configSource, configDest);
    console.log('✓ Copied server.config.json to dist/');
}

const prodConfigSource = path.join(__dirname, '..', 'production.server.config.json');
const prodConfigDest = path.join(distDir, 'production.server.config.json');
if (fs.existsSync(prodConfigSource)) {
    fs.copyFileSync(prodConfigSource, prodConfigDest);
    console.log('✓ Copied production.server.config.json to dist/');
}

// Copy templates directory
const templatesSource = path.join(__dirname, '..', 'templates');
const templatesDest = path.join(distDir, 'templates');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

if (fs.existsSync(templatesSource)) {
    copyDir(templatesSource, templatesDest);
    console.log('✓ Copied templates/ to dist/');
} else {
    console.warn('⚠ templates directory not found');
}

console.log('✓ Asset copy complete');
