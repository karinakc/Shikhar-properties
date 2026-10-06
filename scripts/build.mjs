import { mkdir, cp } from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('dist/assets', { recursive: true });
for (const file of ['index.html','styles.css','refinements.css','app.js','config.js','favicon.svg']) await cp(`src/${file}`, `dist/${file}`);
await Promise.all([1200,1920].map(width => sharp('src/assets/hero.png').resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(`dist/assets/hero-${width}.webp`)));
await sharp('src/assets/hero.png').resize(1000,800,{fit:'cover',position:'right'}).webp({quality:80}).toFile('dist/assets/about.webp');
console.log('Site built in dist/');
