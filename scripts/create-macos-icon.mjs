import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceSvgPath = path.join(projectRoot, 'public', 'logo.svg');
const buildIconsDir = path.join(projectRoot, 'build', 'icons');
const iconsetDir = path.join(buildIconsDir, 'icon.iconset');
const outputIcns = path.join(buildIconsDir, 'icon.icns');
const outputIco = path.join(buildIconsDir, 'icon.ico');

const iconSpecs = [
  ['icon_16x16.png', 16],
  ['icon_16x16@2x.png', 32],
  ['icon_32x32.png', 32],
  ['icon_32x32@2x.png', 64],
  ['icon_128x128.png', 128],
  ['icon_128x128@2x.png', 256],
  ['icon_256x256.png', 256],
  ['icon_256x256@2x.png', 512],
  ['icon_512x512.png', 512],
  ['icon_512x512@2x.png', 1024],
];

async function main() {
  if (!fs.existsSync(sourceSvgPath)) {
    throw new Error(`[icon] Source SVG not found: ${sourceSvgPath}`);
  }

  fs.mkdirSync(buildIconsDir, { recursive: true });

  // Generate Windows ICO
  const icoSizes = [16, 24, 32, 48, 64, 128, 256];
  const icoBuffers = await Promise.all(
    icoSizes.map((size) =>
      sharp(sourceSvgPath, { density: 768 })
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );
  const icoBuffer = await pngToIco(icoBuffers);
  fs.writeFileSync(outputIco, icoBuffer);
  console.log(`[icon] Generated: ${outputIco}`);

  if (process.platform !== 'darwin') {
    console.log('[icon] Skip macOS icon generation on non-darwin platform.');
    return;
  }

  fs.rmSync(iconsetDir, { recursive: true, force: true });
  fs.mkdirSync(iconsetDir, { recursive: true });

  await Promise.all(
    iconSpecs.map(async ([filename, size]) => {
      const targetPath = path.join(iconsetDir, filename);
      await sharp(sourceSvgPath, { density: 768 })
        .resize(size, size)
        .png()
        .toFile(targetPath);
    })
  );

  try {
    execFileSync('iconutil', ['-c', 'icns', iconsetDir, '-o', outputIcns], {
      stdio: 'inherit',
    });
  } catch (error) {
    if (fs.existsSync(outputIcns)) {
      console.warn('[icon] iconutil failed, using existing icon.icns.');
      return;
    }
    throw error;
  }

  console.log(`[icon] Generated: ${outputIcns}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
