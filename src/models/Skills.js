const mongoose = require('mongoose');
const { Schema } = mongoose;

const skillSchema = new Schema({
  skillName: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  dmg: {
    type: String,
    required: true
  },
  cast: {
    type: String,
    required: true
  },
  castCancel: {
    type: String,
    required: true
  },
  cd: {
    type: String,
    required: true
  },
  character: {
    type: String,
    required: true
  },
  dwBoost: {
    type: String
  },
  // Chii mark
  mark: {
    type: String
  },
  // Ephnel bullet
  dmgBullet: {
    type: String
  },
  // Ephnel limit release
  dmgRelease: {
    type: String
  },
  // Jin reinforcement
  dmgReinforcement: {
    type: String
  }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;