const mongoose = require('mongoose');
const { Schema } = mongoose;

const loggerSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  skill: {
    type: Object,
    required: true
  }
})

const Logger = mongoose.model('Logger', loggerSchema);

module.exports = Logger;