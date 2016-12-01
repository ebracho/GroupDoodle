'use strict';

// Use this router LAST! Has catch-all matcher '*' for single-page app

let express = require('express');
let router = new express.Router();

/**
 * Serves index file containing single-page app
 *
 * @param {Request} req
 * @param {Response} res
 */
function home(req, res) {
  res.sendFile(`${__dirname}/index.html`);
}

router.use('/static', express.static('public'));
router.get('/', home);

module.exports = router;
