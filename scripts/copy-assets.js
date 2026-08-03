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

function copyFile(src, dest, label) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied ${label}`);
    } else {
        console.warn(`⚠ Missing asset: ${src}`);
    }
}

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

// Copy frontend assets so Vercel can serve them from dist/
copyFile(
    path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
    path.join(distDir, 'css', 'bootstrap.min.css'),
    'bootstrap.min.css to dist/css/'
);

copyFile(
    path.join(__dirname, '..', 'node_modules', 'bootstrap-icons', 'font', 'bootstrap-icons.min.css'),
    path.join(distDir, 'font', 'bootstrap-icons.min.css'),
    'bootstrap-icons.min.css to dist/font/'
);

const bootstrapIconsFontsSource = path.join(__dirname, '..', 'node_modules', 'bootstrap-icons', 'font', 'fonts');
const bootstrapIconsFontsDest = path.join(distDir, 'fonts');
if (fs.existsSync(bootstrapIconsFontsSource)) {
    copyDir(bootstrapIconsFontsSource, bootstrapIconsFontsDest);
    console.log('✓ Copied bootstrap icon fonts to dist/fonts/');
} else {
    console.warn('⚠ bootstrap icon fonts directory not found');
}

copyFile(
    path.join(__dirname, '..', 'node_modules', 'htmx.org', 'dist', 'htmx.min.js'),
    path.join(distDir, 'htmx.min.js'),
    'htmx.min.js to dist/'
);

console.log('✓ Asset copy complete');
