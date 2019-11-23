import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: path.join(__dirname,'..','uploads','usersImg'),
    filename(req,file,cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null,true);
    else 
        cb(null,false);
};

const upload = multer({storage,fileFilter}).single('userImg');

export default upload;