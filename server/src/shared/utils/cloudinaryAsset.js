const cloudinary = require('../../config/cloudinary');

const MANAGED_PREFIX = 'gundam-universe/';

const uploadBufferToCloudinary = (file, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          isMain: false,
        });
      }
    );

    uploadStream.end(file.buffer);
  });

const uploadFilesToCloudinary = async (files = [], options = {}) => {
  const uploads = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file, options))
  );

  return uploads.map((image, index) => ({
    ...image,
    isMain: index === 0,
  }));
};

const destroyManagedAssets = async (images = []) => {
  const managedImages = images.filter(
    (image) => image?.publicId && image.publicId.startsWith(MANAGED_PREFIX)
  );

  await Promise.allSettled(
    managedImages.map((image) => cloudinary.uploader.destroy(image.publicId))
  );
};

module.exports = {
  uploadFilesToCloudinary,
  destroyManagedAssets,
};
