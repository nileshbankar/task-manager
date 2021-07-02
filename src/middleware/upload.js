const multer = require("multer");
const upload = multer({
  // dest: "avatar", // add this code if you want to store file in folder
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpe?g|png)$/)) {
      return cb(new Error("Please upload image"));
    }
    cb(null, true);
    // // To reject this file pass `false`, like so:
    // cb(null, false);
    // // To accept the file pass `true`, like so:
    // cb(null, true);
    // // You can always pass an error if something goes wrong:
    // cb(new Error("I don't have a clue!"));
  },
});

module.exports = upload;
