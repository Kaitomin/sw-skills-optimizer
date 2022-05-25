const mongoose = require('mongoose')
const { Schema } = mongoose

const targetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  defRate: {
    type: String,
    required: true
  },
  defense: {
    type: String,
    required: true
  },
  defReduction: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },

});

const Target = mongoose.model('Target', targetSchema);

module.exports = Target;