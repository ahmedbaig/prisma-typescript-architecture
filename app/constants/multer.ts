import multer from 'multer';

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images'); // for folder name
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`
        );
    },
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);

    }
};
export const upload = multer({ storage: fileStorage, fileFilter: fileFilter });