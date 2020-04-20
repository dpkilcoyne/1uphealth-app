const express = require('express');
const router = express.Router();

/**
 * Index Router - not needed
 */
router.get('/', (req, res) => {
  console.log('Index page')
  res.send('Index page')
})

module.exports = router;
