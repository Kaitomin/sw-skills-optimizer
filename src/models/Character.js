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

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;