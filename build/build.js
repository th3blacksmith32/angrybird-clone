import esbuild from 'esbuild';
import fs from 'fs';
import crypto from 'crypto';

await esbuild.build({ entryPoints: ['main.js'], bundle: true, outfile: 'dist/main.js', minify: true, format: 'esm' });
const hash = crypto.createHash('md5').update(fs.readFileSync('dist/main.js')).digest('hex').slice(0, 8);
fs.renameSync('dist/main.js', `dist/main.${hash}.js`);
fs.copyFileSync('index.html', 'dist/index.html');
console.log('Build complete with hash', hash);
