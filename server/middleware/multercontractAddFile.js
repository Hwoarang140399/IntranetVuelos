import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: path.join(__dirname,'..','uploads','contractFiles'),
    filename(req,file,cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const upload = multer({storage}).single('file');

export default upload;