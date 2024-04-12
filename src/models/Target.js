const mongoose = require('mongoose')
const { Schema } = mongoose

const targetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  defRate: {
    type: String,
    required: false
  },
  defense: {
    type: String,
    required: true
  },
  defReduction: {
    type: String,
    required: false
  },
  evasion: {
    type: String,
    required: false
  },
  level: {
    type: String,
    required: true
  },
});

const Target = mongoose.model('Target', targetSchema);

module.exports = Target;