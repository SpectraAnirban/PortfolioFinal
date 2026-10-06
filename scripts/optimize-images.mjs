// Converts assets_folder/*.png into web-ready WebP files in public/works.
// GrapheWeddings4 has a personal address + phone in the "Saved Addresses" card, which is blurred.  
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets_folder';
const OUT = 'public/works';

// Regions to blur, as fractions of the image (x, y, w, h) so they survive any source resolution.
const REDACT = {
  'GrapheWeddings4.png': [{ x: 0.413, y: 0.31, w: 0.21, h: 0.165 }],
};

await mkdir(OUT, { recursive: true });

for (const file of (await readdir(SRC)).filter((f) => f.endsWith('.png'))) {
  const src = path.join(SRC, file);
  const { width, height } = await sharp(src).metadata();
  let img = sharp(src);

  const regions = REDACT[file] || [];
  if (regions.length) {
    const overlays = [];
    for (const r of regions) {
      const box = {
        left: Math.round(r.x * width), top: Math.round(r.y * height),
        width: Math.round(r.w * width), height: Math.round(r.h * height),
      };
      const blurred = await sharp(src).extract(box).blur(14).toBuffer();
      overlays.push({ input: blurred, left: box.left, top: box.top });
    }
    img = sharp(await img.composite(overlays).png().toBuffer());
  }

  const name = file.replace('.png', '');
  await img.resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(OUT, `${name}.webp`));
  await sharp(path.join(OUT, `${name}.webp`)).resize({ width: 720 }).webp({ quality: 72 }).toFile(path.join(OUT, `${name}-sm.webp`));
  console.log('ok', name, `${width}x${height}`, regions.length ? '(redacted)' : '');
}
