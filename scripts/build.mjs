import { mkdir, cp } from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('dist/assets', { recursive: true });
for (const file of ['index.html','styles.css','refinements.css','app.js','config.js','favicon.svg']) await cp(`src/${file}`, `dist/${file}`);
await cp('src/assets/about.webp', 'dist/assets/about.webp');
await Promise.all([1200,1920].map(width => sharp('src/assets/hero.png').resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(`dist/assets/hero-${width}.webp`)));
console.log('Site built in dist/');
