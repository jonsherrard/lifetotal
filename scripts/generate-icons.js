const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Create a simple icon with a dark background and light text
async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#000000" />
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-family="Arial, sans-serif" font-size="${size * 0.15}" font-weight="bold" fill="#ffffff">
        LIFE
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
  
  console.log(`Generated icon-${size}x${size}.png`);
}

// Generate both icon sizes
async function generateIcons() {
  try {
    await generateIcon(192);
    await generateIcon(512);
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();