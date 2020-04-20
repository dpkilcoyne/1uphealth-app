const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Model for $everything Patient
 * @todo may want to model oneup_user_id
 */
const everythingPatientSchema = new Schema({
  app_user_id: {
    type: String,
    required: true,
    unique: true
  },
  updated: {
    type: Date,
    default: Date.now
  },
  records: Schema.Types.Mixed
})

module.exports = mongoose.model('EverythingPatient', everythingPatientSchema, 'everythingPatients');
