const express = require('express');
const oneup = require('../oneup.js');
const router = express.Router();

/**
 * Login Router
 * After app login, return quick connect URL
 * @todo Validate usernames
 * @todo Handle EHR IDs
 */
router.post('/', (req, res) => {
  const appUserId = req.body.appUserId;
  const ehrId = '4706';
  oneup.getOrMakeOneUpUserId(appUserId)
    .then(() => {
      res.json( {connectUrl: oneup.connectEhrData(ehrId, appUserId)} );
    })
    .catch(error => {
      console.log('Error: ' + error);
    })
})

module.exports = router;
