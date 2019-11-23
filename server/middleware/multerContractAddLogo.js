import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: path.join(__dirname,'..','uploads','contractImg'),
    filename(req,file,cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const upload = multer({storage}).single('logo');

export default upload;