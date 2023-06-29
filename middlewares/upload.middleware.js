const multer = require('multer');
const cloudinary = require('../util/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure Cloudinary with your account details
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// Set up the Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images', // optional folder name in Cloudinary
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});


const upload = () => {
  // remove the uploaded file if an error occurs during request handling
  // const oldHandler = res.json;
  // res.json = async function (body) {
  //   if (this.statusCode >= 400 &&  req.file) {
  //     // const publicId = req.file.path;
      
  //       const publicId = req.file.path.split('/').pop().split('.')[0];
  //       await cloudinary.uploader.destroy(publicId);
      
  //     // cloudinary.uploader.destroy(publicId); // remove uploaded file from Cloudinary if an error occurred
  //   }
  //   oldHandler.apply(this, arguments);
  // };

  return multer({ storage: storage,limits: { fileSize: 5 * 1024 * 1024 } }).single('image');
  // return multerUpload(req, res, async function (err) {
  //   if (err instanceof multer.MulterError) {
  //     // handle Multer error
  //     if (err.code === 'LIMIT_FILE_SIZE') {
  //       return res.status(400).json({ error: 'File size limit exceeded' });
  //     }
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
  //   if (err) {
  //     if (req.file.path && req.file) {
  //       const publicId = req.file.path.split('/').pop().split('.')[0];
  //      await cloudinary.uploader.destroy(publicId); // remove uploaded file from Cloudinary if an error occurred
  //     }
  //     return next(err);
  //   }
  //   next();
  // });
};

module.exports = upload;