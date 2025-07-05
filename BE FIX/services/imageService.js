const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Compress and resize an image file, overwrite or save as new file.
 * @param {string} inputPath - Path to the original image
 * @param {string} outputPath - Path to save the compressed image
 * @param {object} [options] - Options for sharp
 * @returns {Promise<void>}
 */
async function compressImage(inputPath, outputPath, options = {}) {
  const { width = 1200, quality = 80, format = 'jpeg' } = options;
  let pipeline = sharp(inputPath).resize({ width, withoutEnlargement: true });
  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality });
  } else if (format === 'png') {
    pipeline = pipeline.png({ quality });
  }
  await pipeline.toFile(outputPath);
}

module.exports = { compressImage };
