const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'MEMBER'
  }
});

// Hash password before saving to DB
userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});

// static method 
userSchema.statics.login = async function(username, password) {
 
  const user = await this.findOne({ username });
  
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Wrong credentials');
  }
  throw Error('Wrong credentials');
};

const User = mongoose.model('User', userSchema);

module.exports = User;