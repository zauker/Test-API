'use strict';

const router = require('express').Router();
const cors = require('cors');

const ctrl = require('../controllers/fortune.controller.js');

// middleware funcion
router.use(cors());

/** routes
 * /fortune  when called with GET, tells fortune
 */

router.get('/', ctrl.getFortune);

module.exports = router;