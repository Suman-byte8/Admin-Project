// Image compression utility for admin panel uploads
export const compressImage = async (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with compressed data
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

// Batch compress multiple images
export const compressImages = async (files, options = {}) => {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options;

  const compressionPromises = files.map(file =>
    compressImage(file, maxWidth, maxHeight, quality)
  );

  return Promise.all(compressionPromises);
};

// Check if file needs compression (size > 1MB)
export const shouldCompress = (file) => {
  const ONE_MB = 1024 * 1024;
  return file.size > ONE_MB;
};
