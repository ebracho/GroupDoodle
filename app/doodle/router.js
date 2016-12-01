'use strict';

let express = require('express');
let router = new express.Router();

/**
 * Response with a list of active rooms and their members
 *
 * @param {Request} req
 * @param {Response} res
 */
function getActiveRooms(req, res) {
}

/**
 * Responds with a list of published Doodles
 *
 * @param {Request} req
 * @param {Response} res
 */
function getDoodleList(req, res) {
}

/**
 * Response with the contents of a published Doodle
 *
 * @param {Request} req
 * @param {Response} res
 */
function getDoodle(req, res) {
}

module.exports = router;
