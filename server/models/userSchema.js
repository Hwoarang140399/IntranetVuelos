import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const user = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    lastName: String,
    password: String,
    capability: {
        type: String,
        require: true
    },
    lvlAgent: String,
    gender: String,
    userImg: String,
    country: String,
    company: String,
    jobTitle: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    creationDate: Date,
    lastPwdChange: Date,
    lastLogout: Date,
    isActive: Boolean
});

user.methods.encryptPassword = async (password) => {
    return await bcrypt.hash(password,10);
}

user.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

user.plugin(uniqueValidator);

// module.exports = mongoose.model('User',user);
export default mongoose.model('User',user);