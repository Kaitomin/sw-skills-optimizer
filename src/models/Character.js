const mongoose = require('mongoose');
const { Schema } = mongoose;

const characterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  // avatar: {
  //   data: Buffer,
  //   contentType: String,
  // },
  icon: {
    type: String
  }
});


// userSchema.pre('save', async function(next) {
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });


const Character = mongoose.model('Character', characterSchema);


// User.prototype.comparePassword = async function(password) {
//   return await bcrypt.compare(password, this.password)
// }

module.exports = Character;