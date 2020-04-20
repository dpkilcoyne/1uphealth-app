const express = require('express');
const oneup = require('../oneup.js');
const EverythingPatient = require('../models/everything.model');
const router = express.Router();

/**
 * Route to retrieve 1upHealth resources and save to MongoDB
 * @todo appUserId needs to be replaced by authenticating their session
 * @todo currently it's using the first key in the token cache
 * @todo replace patientId w/ ID retrieved from API (using default for fhirjason)
 * @todo should use updateOne instead of save for existing users
 */
router.get('/', async (req, res) => {
  const appUserId = Object.keys(oneup.accessTokenCache)[0];
  const patientId = 'f8fedcd9e6e5';

  // Retrieve resources
  try {
    const resourceTables = await oneup.getFhirEverythingQuery(
      oneup.accessTokenCache[appUserId].access_token,
      patientId
    )

    // Upsert to MongoDB and send resource types back to client
    const patient = await new EverythingPatient({
      app_user_id: appUserId,
      updated: Date.now(),
      records: resourceTables
    });
    patient.save();
    res.json( {resources: Object.keys(patient.records)} );

  } catch(error) {
    console.log('Error: ' + error)
  }
})

/**
 * Routing for resource tables
 * @todo need to use session for user id
 * @return {resourceData: Array of resource documents of the same type}
 */
router.get('/:resource', async (req, res) => {
  const appUserId = Object.keys(oneup.accessTokenCache)[0];
  const resource = req.params.resource;
  const userData = await EverythingPatient.findOne( {app_user_id: appUserId} );
  const resourceData = userData.records[resource];

  res.json( {resourceData: resourceData } )
})

module.exports = router;
