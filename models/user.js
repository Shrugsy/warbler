const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
});

// use a hook to hash the password before saving it
userSchema.pre('save', async function(next){
    try {
        // is password not changed, just leave it
        if(!this.isModified('password')){
            return next();
        }
        // otherwise hash it and then save it
        let hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword;
        return next();
    } catch(err){
        return next(err);
    }
})

// compare received password with the one in the database
// returns a promise which will return a boolean (true if passwords match AFTER encrypting)
userSchema.methods.comparePassword = async function(candidatePassword, next){
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password)
        // isMatch will be boolean
        return isMatch;
    } catch (err) {
        return next(err);
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;