import fs from 'fs';
const files = fs.readdirSync('dist');
console.log('Simulated upload to CDN:');
files.forEach(f => console.log(`Uploading dist/${f} -> https://cdn.example.com/${f}`));
console.log('Set Cache-Control: public, max-age=31536000 for hashed assets');
